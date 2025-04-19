import express from "express";
import { getTagsWithQuestionNumber } from "../controllers/tagController";

const router = express.Router();

/**
 * route to get tags with question number
 */
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);

export default router;
