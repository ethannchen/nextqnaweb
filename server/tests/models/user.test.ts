import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../models/users";
import { IUser } from "../../types/types";

// Mock bcrypt functions
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn(),
}));

describe("User Model", () => {
  // Connect to a test database before running tests
  beforeAll(async () => {
    const mongoURI =
      process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fake_so_test";
    await mongoose.connect(mongoURI);
  });

  // Clear the database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect after all tests are done
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("User Document Instance Methods", () => {
    it("should correctly compare passwords", async () => {
      // Create a user
      const userData: IUser = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.createUser(userData);

      // Mock bcrypt.compare to return true for correct password
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const correctPasswordMatch = await user.comparePassword("password123");
      expect(correctPasswordMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", user.password);

      // Mock bcrypt.compare to return false for incorrect password
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const incorrectPasswordMatch = await user.comparePassword(
        "wrongpassword"
      );
      expect(incorrectPasswordMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        user.password
      );
    });
  });

  describe("User Model Static Methods", () => {
    describe("findByEmail", () => {
      it("should find a user by email", async () => {
        // Create a user
        const userData: IUser = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        };

        await User.createUser(userData);

        // Find user by email
        const foundUser = await User.findByEmail("test@example.com");
        expect(foundUser).not.toBeNull();
        expect(foundUser?.email).toBe("test@example.com");
        expect(foundUser?.username).toBe("testuser");
      });

      it("should return null if user with email does not exist", async () => {
        const foundUser = await User.findByEmail("nonexistent@example.com");
        expect(foundUser).toBeNull();
      });
    });

    describe("findByUsername", () => {
      it("should find a user by username", async () => {
        // Create a user
        const userData: IUser = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        };

        await User.createUser(userData);

        // Find user by username
        const foundUser = await User.findByUsername("testuser");
        expect(foundUser).not.toBeNull();
        expect(foundUser?.username).toBe("testuser");
        expect(foundUser?.email).toBe("test@example.com");
      });

      it("should return null if user with username does not exist", async () => {
        const foundUser = await User.findByUsername("nonexistentuser");
        expect(foundUser).toBeNull();
      });
    });

    describe("createUser", () => {
      it("should create a new user with hashed password", async () => {
        const userData: IUser = {
          username: "newuser",
          email: "newuser@example.com",
          password: "password123",
        };

        const user = await User.createUser(userData);

        expect(user._id).toBeDefined();
        expect(user.username).toBe("newuser");
        expect(user.email).toBe("newuser@example.com");
        expect(user.password).toBe("hashedPassword"); // Should be hashed
        expect(user.role).toBe("user"); // Default role
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      });
    });

    describe("addNewUser", () => {
      it("should add a new user successfully", async () => {
        const userData: IUser = {
          username: "anotheruser",
          email: "another@example.com",
          password: "password123",
        };

        const user = await User.addNewUser(userData);

        expect(user._id).toBeDefined();
        expect(user.username).toBe("anotheruser");
        expect(user.email).toBe("another@example.com");
      });

      it("should throw an error if email is already registered", async () => {
        // Create first user
        const userData1: IUser = {
          username: "user1",
          email: "duplicate@example.com",
          password: "password123",
        };
        await User.createUser(userData1);

        // Try to create second user with same email
        const userData2: IUser = {
          username: "user2",
          email: "duplicate@example.com",
          password: "password456",
        };

        await expect(User.addNewUser(userData2)).rejects.toThrow(
          "Email is already registered"
        );
      });

      it("should throw an error if username is already taken", async () => {
        // Create first user
        const userData1: IUser = {
          username: "duplicateusername",
          email: "user1@example.com",
          password: "password123",
        };
        await User.createUser(userData1);

        // Try to create second user with same username
        const userData2: IUser = {
          username: "duplicateusername",
          email: "user2@example.com",
          password: "password456",
        };

        await expect(User.addNewUser(userData2)).rejects.toThrow(
          "Username is already taken"
        );
      });
    });

    describe("updateProfile", () => {
      it("should update user profile", async () => {
        // Create a user
        const userData: IUser = {
          username: "originaluser",
          email: "original@example.com",
          password: "password123",
          bio: "Original bio",
        };

        const user = await User.createUser(userData);

        // Update profile
        const updatedData = {
          username: "updateduser",
          email: "updated@example.com",
          bio: "Updated bio",
          website: "https://example.com",
        };

        const updatedUser = await User.updateProfile(user._id, updatedData);

        expect(updatedUser).toBeDefined();
        expect(updatedUser.username).toBe("updateduser");
        expect(updatedUser.email).toBe("updated@example.com");
        expect(updatedUser.bio).toBe("Updated bio");
        expect(updatedUser.website).toBe("https://example.com");
      });

      it("should throw an error if user not found", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const updateData = { username: "newname" };

        await expect(
          User.updateProfile(nonExistentId, updateData)
        ).rejects.toThrow("User not found");
      });

      it("should throw an error if new username is already taken", async () => {
        // Create two users
        const user1 = await User.createUser({
          username: "user1",
          email: "user1@example.com",
          password: "password123",
        });

        await User.createUser({
          username: "user2",
          email: "user2@example.com",
          password: "password456",
        });

        // Try to update user1 with user2's username
        await expect(
          User.updateProfile(user1._id, { username: "user2" })
        ).rejects.toThrow("Username is already taken");
      });

      it("should throw an error if new email is already registered", async () => {
        // Create two users
        const user1 = await User.createUser({
          username: "emailuser1",
          email: "emailuser1@example.com",
          password: "password123",
        });

        await User.createUser({
          username: "emailuser2",
          email: "emailuser2@example.com",
          password: "password456",
        });

        // Try to update user1 with user2's email
        await expect(
          User.updateProfile(user1._id, { email: "emailuser2@example.com" })
        ).rejects.toThrow("Email is already registered");
      });
    });

    describe("changePassword", () => {
      it("should change user password successfully when provided correct current password", async () => {
        // Create a user
        const userData: IUser = {
          username: "passworduser",
          email: "password@example.com",
          password: "currentpassword",
        };

        const user = await User.createUser(userData);

        // Mock bcrypt.compare to return true
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        // Change password
        await User.changePassword(user._id, "newpassword", "currentpassword");
      });

      it("should throw error if current password is incorrect", async () => {
        // Create a user
        const userData: IUser = {
          username: "passworduser2",
          email: "password2@example.com",
          password: "currentpassword",
        };

        const user = await User.createUser(userData);

        // Mock bcrypt.compare to return false
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

        // Try to change password with wrong current password
        await expect(
          User.changePassword(user._id, "newpassword", "wrongpassword")
        ).rejects.toThrow("Current password is incorrect");
      });

      it("should throw error if user not found", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        await expect(
          User.changePassword(nonExistentId, "newpassword", "currentpassword")
        ).rejects.toThrow("User not found");
      });

      it("should throw error if passwords are not provided", async () => {
        // Create a user
        const userData: IUser = {
          username: "passworduser3",
          email: "password3@example.com",
          password: "currentpassword",
        };

        const user = await User.createUser(userData);

        // Try to change password without providing passwords
        await expect(User.changePassword(user._id, "", "")).rejects.toThrow(
          "Current password and new password are required"
        );
      });
    });

    describe("deleteUser", () => {
      it("should delete a user successfully", async () => {
        // Create a user
        const userData: IUser = {
          username: "deleteuser",
          email: "delete@example.com",
          password: "password123",
        };

        const user = await User.createUser(userData);

        // Delete the user
        const deletedUser = await User.deleteUser(user._id);

        expect(deletedUser._id).toEqual(user._id);

        // Verify user is actually deleted
        const foundUser = await User.findById(user._id);
        expect(foundUser).toBeNull();
      });

      it("should throw error if user not found", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        await expect(User.deleteUser(nonExistentId)).rejects.toThrow(
          "User not found"
        );
      });
    });
  });
});
