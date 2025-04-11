import express from "express";
import { addAnswer, voteAnswer } from "../controllers/answerController";

const router = express.Router();

router.post("/addAnswer", addAnswer);
router.patch("/:aid/vote", voteAnswer);

export default router;
