import mongoose from "mongoose";
import TagSchema from "./schema/tag";
import { ITagDocument, ITagModel } from "../types/types";

/**  Mongoose model for Tag documents.*/
export const Tag = mongoose.model<ITagDocument, ITagModel>("Tag", TagSchema);

export default Tag;
