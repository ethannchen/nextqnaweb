import { Request, Response } from "express";
import Tag from "../models/tags";
import { asyncHandler } from "../utils/errorUtils";

const getTagsWithQuestionNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const tagsWithCounts = await Tag.getTagsWithQuestionNumber();
    res.status(200).json(tagsWithCounts);
  }
);

export { getTagsWithQuestionNumber };
