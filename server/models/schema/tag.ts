import mongoose from "mongoose";
import { ITag, ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */

const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  { name: { type: String, required: true } },
  { collection: "Tag" }
);

/**
 * An async method that finds existing tags by name or creates new tags if they do not exist
 * @param tagNames - the list of tag names
 * @returns the existing tags or newly created tags using the tag name list
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
 * An async method that validates an array of tag ids is the same as the number of tag documents in the collection
 * @param tagIds - the array of tag ids
 * @returns boolean indicating if the tag id array length is the same as the count of tag documents in the collection
 */
TagSchema.statics.validateTags = async function (
  tagIds: mongoose.Types.ObjectId[]
): Promise<boolean> {
  const count = await this.countDocuments({ _id: { $in: tagIds } });
  return count === tagIds.length;
};

/**
 * An async method that get all tags with corresponding question count
 * @returns tags array with corresponding question count
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
 * An async method that get tags with ID using a tag array that contains tag names
 * @param tags - tag array with tag names
 * @returns tag arrays with tag IDs
 */
TagSchema.statics.getTags = async function (tags: ITag[]): Promise<ITag[]> {
  const tagNames = tags.map((t) => t.name);
  const tagDocuments = await this.findOrCreateMany(tagNames);

  return tagDocuments;
};

export default TagSchema;
