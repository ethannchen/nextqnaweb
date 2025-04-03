import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUserDocument, IUserModel } from "../types/types";

// Create and export the model
export const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  UserSchema
);

export default User;
