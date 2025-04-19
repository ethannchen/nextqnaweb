import express from "express";
import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../controllers/answerController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * routes to add answer, vote for an anwser, and add comments to an answer
 */
router.post("/addAnswer", authenticate, addAnswer);
router.patch("/:aid/vote", authenticate, voteAnswer);
router.post("/:aid/addComment", authenticate, addComment);

export default router;
