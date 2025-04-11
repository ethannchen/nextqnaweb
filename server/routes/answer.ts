import express from "express";
import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../controllers/answerController";

const router = express.Router();

router.post("/addAnswer", addAnswer);
router.patch("/:aid/vote", voteAnswer);
router.post("/:aid/addComment", addComment);

export default router;
