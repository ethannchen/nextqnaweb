import { Request, Response } from "express";
import Tag from "../models/tags";

const getTagsWithQuestionNumber = async (req: Request, res: Response) => {
  try {
    const tagsWithCounts = await Tag.getTagsWithQuestionNumber();
    res.status(200).json(tagsWithCounts);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving tags",
      error: (err as Error).message,
    });
  }
};

export { getTagsWithQuestionNumber };
