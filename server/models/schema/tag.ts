import mongoose from "mongoose";
import { ITag, ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 *
 * Defines the structure and behavior for tag documents in the application.
 * Tags are used to categorize questions for better searchability.
 *
 * @property {string} name - The unique name of the tag (required)
 */
const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  { name: { type: String, required: true } },
  { collection: "Tag" }
);

/**
 * Finds existing tags by name or creates new tags if they don't exist
 *
 * @param {string[]} tagNames - Array of tag names to find or create
 * @returns {Promise<ITag[]>} Promise resolving to an array of tag objects
 */
TagSchema.statics.findOrCreateMany = async function (
  tagNames: string[]
): Promise<ITag[]> {
  const tags: ITag[] = [];
  await Promise.all(
    tagNames.map(async (t) => {
      let tag = await this.findOne({ name: t }).exec();
      if (!tag) {
        tag = await new this({ name: t }).save();
      }
      tags.push(tag);
    })
  );
  return tags;
};

/**
 * Validates an array of tag IDs by ensuring they exist in the database
 *
 * @param {mongoose.Types.ObjectId[]} tagIds - Array of tag ObjectIds to validate
 * @returns {Promise<boolean>} Promise resolving to true if all tags exist, false otherwise
 */
TagSchema.statics.validateTags = async function (
  tagIds: mongoose.Types.ObjectId[]
): Promise<boolean> {
  const count = await this.countDocuments({ _id: { $in: tagIds } });
  return count === tagIds.length;
};

/**
 * Retrieves all tags with their corresponding question counts
 * Uses MongoDB aggregation to join with the Questions collection
 *
 * @returns {Promise<ITag[]>} Promise resolving to array of tags with question counts
 */
TagSchema.statics.getTagsWithQuestionNumber = async function (): Promise<
  ITag[]
> {
  const tagsWithCounts: ITag[] = await this.aggregate([
    {
      $lookup: {
        from: "Question",
        localField: "_id",
        foreignField: "tags",
        as: "questions",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        qcnt: { $size: "$questions" },
      },
    },
  ]);
  return tagsWithCounts;
};

/**
 * Gets or creates tags based on an array of tag objects containing names
 *
 * @param {ITag[]} tags - Array of tag objects with name properties
 * @returns {Promise<ITag[]>} Promise resolving to array of complete tag objects with IDs
 */
TagSchema.statics.getTags = async function (tags: ITag[]): Promise<ITag[]> {
  const tagNames = tags.map((t) => t.name);
  const tagDocuments = await this.findOrCreateMany(tagNames);

  return tagDocuments;
};

export default TagSchema;
