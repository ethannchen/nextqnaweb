import mongoose from "mongoose";
import { IAnswerModel, IAnswerDocument } from "../types/types";
import AnswerSchema from "./schema/answer";

// Mongoose model for Answer documents.
const Answer = mongoose.model<IAnswerDocument, IAnswerModel>(
  "Answer",
  AnswerSchema
);

export default Answer;
