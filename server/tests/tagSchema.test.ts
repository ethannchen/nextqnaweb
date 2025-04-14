import mongoose from "mongoose";
import Tag from "../models/tags";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Tag Schema Tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Tag.deleteMany({});
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  describe("Static Methods", () => {
    describe("findOrCreateMany", () => {
      it("should create new tags if they don't exist", async () => {
        const tagNames = ["react", "javascript", "typescript"];

        const result = await Tag.findOrCreateMany(tagNames);

        expect(result.length).toBe(3);
        expect(result.map((t) => t.name)).toEqual(
          expect.arrayContaining(tagNames)
        );

        const savedTags = await Tag.find({});
        expect(savedTags.length).toBe(3);
      });

      it("should find existing tags without creating duplicates", async () => {
        await new Tag({ name: "react" }).save();
        await new Tag({ name: "javascript" }).save();

        const tagNames = ["react", "javascript", "typescript"];

        const result = await Tag.findOrCreateMany(tagNames);

        expect(result.length).toBe(3);
        expect(result.map((t) => t.name)).toEqual(
          expect.arrayContaining(tagNames)
        );

        const savedTags = await Tag.find({});
        expect(savedTags.length).toBe(3);
      });

      it("should return empty array for empty input", async () => {
        const result = await Tag.findOrCreateMany([]);

        expect(result).toEqual([]);

        const savedTags = await Tag.find({});
        expect(savedTags.length).toBe(0);
      });
    });

    describe("validateTags", () => {
      it("should return true if all tag IDs exist", async () => {
        const tag1 = await new Tag({ name: "react" }).save();
        const tag2 = await new Tag({ name: "javascript" }).save();
        const tag3 = await new Tag({ name: "typescript" }).save();

        const tagIds = [
          new mongoose.Types.ObjectId(tag1._id),
          new mongoose.Types.ObjectId(tag2._id),
          new mongoose.Types.ObjectId(tag3._id),
        ];
        const result = await Tag.validateTags(tagIds);

        expect(result).toBe(true);
      });

      it("should return false if some tag IDs don't exist", async () => {
        const tag1 = await new Tag({ name: "react" }).save();
        const tag2 = await new Tag({ name: "javascript" }).save();
        const nonExistentId = new mongoose.Types.ObjectId();

        const tagIds = [
          new mongoose.Types.ObjectId(tag1._id),
          new mongoose.Types.ObjectId(tag2._id),
          nonExistentId,
        ];

        const result = await Tag.validateTags(tagIds);

        expect(result).toBe(false);
      });

      it("should return true for empty array", async () => {
        const result = await Tag.validateTags([]);

        expect(result).toBe(true);
      });
    });

    describe("getTagsWithQuestionNumber", () => {
      it("should return tags with question counts", async () => {
        const mockAggregateResult = [
          { _id: new mongoose.Types.ObjectId(), name: "react", qcnt: 5 },
          { _id: new mongoose.Types.ObjectId(), name: "javascript", qcnt: 3 },
          { _id: new mongoose.Types.ObjectId(), name: "typescript", qcnt: 2 },
        ];

        Tag.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

        const result = await Tag.getTagsWithQuestionNumber();

        expect(result).toEqual(mockAggregateResult);
        expect(Tag.aggregate).toHaveBeenCalled();
      });
    });

    describe("getTags", () => {
      it("should find or create tags based on input", async () => {
        Tag.findOrCreateMany = jest
          .fn()
          .mockImplementation(async (tagNames) => {
            return tagNames.map((name: string) => ({
              _id: new mongoose.Types.ObjectId(),
              name,
            }));
          });

        const inputTags = [
          { name: "react" },
          { name: "javascript" },
          { name: "typescript" },
        ];

        const result = await Tag.getTags(inputTags);

        expect(result.length).toBe(3);
        expect(Tag.findOrCreateMany).toHaveBeenCalledWith([
          "react",
          "javascript",
          "typescript",
        ]);

        const resultNames = result.map((tag) => tag.name);
        expect(resultNames).toEqual(
          expect.arrayContaining(["react", "javascript", "typescript"])
        );
      });

      it("should return empty array for empty input", async () => {
        Tag.findOrCreateMany = jest.fn().mockResolvedValue([]);

        const result = await Tag.getTags([]);

        expect(result).toEqual([]);
        expect(Tag.findOrCreateMany).toHaveBeenCalledWith([]);
      });
    });
  });
});
