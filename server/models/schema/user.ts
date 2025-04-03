import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserDocument, IUserModel } from "../../types/types";

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

// Instance method to compare password (used for authentication)
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find a user by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

// Static method to find a user by username
UserSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

// Static method to create a new user
UserSchema.statics.createUser = async function (userData: IUser) {
  // Hash the password before saving it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Create and return the user
  const newUser = new this({
    ...userData,
    password: hashedPassword, // Use hashed password here
  });

  return newUser.save();
};

// Export the model
export default UserSchema;
