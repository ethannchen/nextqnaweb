import { Request, Response } from "express";
import Tag from "../models/tags";
import asyncHandler from "express-async-handler";

/**
 * @route GET /tags
 * @description Fetches all tags with their associated question counts
 * @returns {200} JSON response with the tags and their question counts
 * @returns {500} JSON error if there is an internal server error
 */
const getTagsWithQuestionNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const tagsWithCounts = await Tag.getTagsWithQuestionNumber();
    res.status(200).json(tagsWithCounts);
  }
);

export { getTagsWithQuestionNumber };
