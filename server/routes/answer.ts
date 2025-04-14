import express from "express";
import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../controllers/answerController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/addAnswer", authenticate, addAnswer);
router.patch("/:aid/vote", authenticate, voteAnswer);
router.post("/:aid/addComment", authenticate, addComment);

export default router;
