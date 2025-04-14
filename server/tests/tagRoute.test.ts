import express, { Application } from "express";
import request from "supertest";
import tagRoutes from "../routes/tag";
import { getTagsWithQuestionNumber } from "../controllers/tagController";

jest.mock("../controllers/tagController", () => ({
  getTagsWithQuestionNumber: jest.fn((req, res) => {
    res.status(200).json({ success: true });
  }),
}));

describe("Tag Routes", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use("/tags", tagRoutes);

    jest.clearAllMocks();
  });

  test("should route to getTagsWithQuestionNumber controller", async () => {
    const response = await request(app).get("/tags/getTagsWithQuestionNumber");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });

    expect(getTagsWithQuestionNumber).toHaveBeenCalledTimes(1);
  });
});
