import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserDocument, IUserModel } from "../../types/types";

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    bio: { type: String, required: false },
    website: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Users" }
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

// Static method to handle the complete user addition process
UserSchema.statics.addNewUser = async function (userData: IUser) {
  // Check if the email already exists
  const existingUserByEmail = await this.findByEmail(userData.email);
  if (existingUserByEmail) {
    throw new Error("Email is already registered");
  }

  // Check if the username already exists
  const existingUserByUsername = await this.findByUsername(userData.username);
  if (existingUserByUsername) {
    throw new Error("Username is already taken");
  }

  // Set default role if not provided
  const userDataWithDefaults = {
    ...userData,
    role: userData.role || "user",
  };

  // Create and return the new user
  return this.createUser(userDataWithDefaults);
};

// Static method to update a user profile
UserSchema.statics.updateProfile = async function (
  userId: string,
  profileData: Partial<IUser>
) {
  // Find the user to update
  const user = await this.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // If username is changing, check if it already exists
  if (profileData.username && profileData.username !== user.username) {
    const existingUser = await this.findByUsername(profileData.username);
    if (existingUser) {
      throw new Error("Username is already taken");
    }
  }

  // If email is changing, check if it already exists
  if (profileData.email && profileData.email !== user.email) {
    const existingUser = await this.findByEmail(profileData.email);
    if (existingUser) {
      throw new Error("Email is already registered");
    }
  }

  // Update user fields with new data
  if (profileData.username) user.username = profileData.username;
  if (profileData.email) user.email = profileData.email;
  if (profileData.bio !== undefined) user.bio = profileData.bio;
  if (profileData.website !== undefined) user.website = profileData.website;

  // Save and return the updated user
  await user.save();

  // Return a clean user object without the password
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    bio: user.bio,
    website: user.website,
  };
};

// Static method to change user password
UserSchema.statics.changePassword = async function (
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  // Input validation
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  // Find the user
  const user = await this.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Save updated user
  await user.save();

  return true;
};

// Static method to delete a user
UserSchema.statics.deleteUser = async function (userId: string) {
  // Find and delete the user
  const deletedUser = await this.findByIdAndDelete(userId);

  // Check if user was found and deleted
  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
};

// Export the model
export default UserSchema;
