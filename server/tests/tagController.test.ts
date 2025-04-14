import { Request, Response } from "express";
import mongoose from "mongoose";
import { getTagsWithQuestionNumber } from "../controllers/tagController";
import Tag from "../models/tags";

// Define the proper type for the request handler function
type RequestHandler = (
  req: Request,
  res: Response,
  next: (error?: Error | unknown) => void
) => Promise<void> | void;

// Mock the Tag model
jest.mock("../models/tags");
jest.mock("../utils/errorUtils", () => ({
  // Use the RequestHandler type instead of any
  asyncHandler: (fn: RequestHandler) => fn,
}));

describe("Tag Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      header: jest.fn(),
      user: {
        id: new mongoose.Types.ObjectId(),
        role: "user",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getTagsWithQuestionNumber", () => {
    test("should return tags with question counts", async () => {
      // Mock data
      const mockTagsWithCounts = [
        { name: "javascript", count: 10 },
        { name: "react", count: 5 },
        { name: "node.js", count: 3 },
      ];

      // Mock Tag.getTagsWithQuestionNumber to return the mock data
      Tag.getTagsWithQuestionNumber = jest
        .fn()
        .mockResolvedValue(mockTagsWithCounts);

      // Call the controller function
      await getTagsWithQuestionNumber(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(Tag.getTagsWithQuestionNumber).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTagsWithCounts);
    });

    test("should handle errors when Tag.getTagsWithQuestionNumber fails", async () => {
      // Mock Tag.getTagsWithQuestionNumber to throw an error
      const mockError = new Error("Database error");
      Tag.getTagsWithQuestionNumber = jest.fn().mockRejectedValue(mockError);

      // Call the controller function and expect it to throw
      await expect(
        getTagsWithQuestionNumber(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).rejects.toThrow("Database error");

      // Assertions
      expect(Tag.getTagsWithQuestionNumber).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    test("should return empty array when no tags are found", async () => {
      // Mock Tag.getTagsWithQuestionNumber to return empty array
      Tag.getTagsWithQuestionNumber = jest.fn().mockResolvedValue([]);

      // Call the controller function
      await getTagsWithQuestionNumber(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(Tag.getTagsWithQuestionNumber).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });
});
