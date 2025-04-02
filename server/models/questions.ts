import mongoose from "mongoose";
import QuestionSchema from "./schema/question";
import { IQuestionDocument, IQuestionModel } from "../types/types";

// Mongoose model for Question documents.
const Question = mongoose.model<IQuestionDocument, IQuestionModel>(
  "Question",
  QuestionSchema
);

export default Question;
