import mongoose from "mongoose";
import { IUser, IUserDocument, IUserModel } from "../../types/types";

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

// Static method to find a user by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

// Static method to create a new user
UserSchema.statics.createUser = async function (userData: IUser) {
  return this.create(userData);
};

export default UserSchema;
