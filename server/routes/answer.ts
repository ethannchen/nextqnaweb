import express from "express";
import { addAnswer } from "../controllers/answerController";

const router = express.Router();

router.post("/addAnswer", addAnswer);

export default router;
