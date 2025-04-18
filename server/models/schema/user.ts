import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserDocument, IUserModel } from "../../types/types";

/**
 * Schema for documents in the Users collection
 *
 * Defines the structure and behavior for user documents in the application.
 * Contains user account information, authentication methods, and profile data.
 *
 * @property {String} username - Unique username for the user (required)
 * @property {String} email - Unique email address for the user (required)
 * @property {String} password - Hashed password for authentication (required)
 * @property {String} role - User role for access control (enum: ['user', 'admin'], default: 'user')
 * @property {String} bio - Optional user biography
 * @property {String} website - Optional user website URL
 * @property {Date} createdAt - When the user account was created (default: Date.now)
 */
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

/**
 * Instance method to compare a candidate password with the stored hashed password
 * Used for authentication during login
 *
 * @param {string} candidatePassword - The plaintext password to check
 * @returns {Promise<boolean>} Promise resolving to true if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static method to find a user by email address
 *
 * @param {string} email - The email address to search for
 * @returns {Promise<IUserDocument | null>} Promise resolving to the user document or null if not found
 */
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

/**
 * Static method to find a user by username
 *
 * @param {string} username - The username to search for
 * @returns {Promise<IUserDocument | null>} Promise resolving to the user document or null if not found
 */
UserSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

/**
 * Static method to create a new user with password hashing
 *
 * @param {IUser} userData - The user data to create
 * @returns {Promise<IUserDocument>} Promise resolving to the created user document
 */
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

/**
 * Static method to handle the complete user registration process
 * Validates that username and email are unique before creating the user
 *
 * @param {IUser} userData - The user data to register
 * @returns {Promise<IUserDocument>} Promise resolving to the created user document
 * @throws {Error} If email is already registered or username is already taken
 */
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

/**
 * Static method to update a user's profile information
 *
 * @param {string} userId - The ID of the user to update
 * @param {Partial<IUser>} profileData - The profile data to update
 * @returns {Promise<Object>} Promise resolving to the updated user data (without password)
 * @throws {Error} If user not found, username already taken, or email already registered
 */
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

/**
 * Static method to change a user's password
 * Verifies the current password before allowing the change
 *
 * @param {string} userId - The ID of the user to update
 * @param {string} currentPassword - The user's current password for verification
 * @param {string} newPassword - The new password to set
 * @returns {Promise<boolean>} Promise resolving to true if password was changed
 * @throws {Error} If user not found, inputs missing, or current password incorrect
 */
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

/**
 * Static method to delete a user account
 *
 * @param {string} userId - The ID of the user to delete
 * @returns {Promise<IUserDocument>} Promise resolving to the deleted user document
 * @throws {Error} If user not found
 */
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
