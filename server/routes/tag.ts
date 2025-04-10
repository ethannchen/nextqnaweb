import express from "express";
import { getTagsWithQuestionNumber } from "../controllers/tagController";

const router = express.Router();

router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);

export default router;
