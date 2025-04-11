import express from "express";
import {
  addQuestion,
  getQuestionById,
  getQuestion,
} from "../controllers/questionController";

const router = express.Router();

router.post("/addQuestion", addQuestion);

router.get("/getQuestionById/:qid", getQuestionById);

router.get("/getQuestion", getQuestion);

export default router;
