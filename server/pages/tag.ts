import express, { Response } from "express";
import Tag from "../models/tags";

const router = express.Router();

/**
 * @route GET /getTagsWithQuestionNumber
 * @description Retrieves all tags along with the number of questions associated with each tag
 * @returns {200} JSON response with the list of tags and their question counts
 * @returns {500} JSON error if there is an internal server error
 */
router.get("/getTagsWithQuestionNumber", async (_, res: Response) => {
  try {
    const tagsWithCounts = await Tag.getTagsWithQuestionNumber();
    res.status(200).json(tagsWithCounts);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving tags",
      error: (err as Error).message,
    });
  }
});

export default router;
