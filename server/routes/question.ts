import express from "express";
import {
  addQuestion,
  getQuestionById,
  getQuestion,
} from "../controllers/questionController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/addQuestion", authenticate, addQuestion);

router.get("/getQuestionById/:qid", getQuestionById);

router.get("/getQuestion", getQuestion);

export default router;
