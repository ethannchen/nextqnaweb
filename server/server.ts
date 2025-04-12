import cors from "cors";
import mongoose from "mongoose";
import { Server } from "http"; // Import the Server type from Node.js
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { middleware } from "express-openapi-validator";
import path from "path";
import tagRouter from "./routes/tag";
import questionRouter from "./routes/question";
import answerRouter from "./routes/answer";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import { errorHandler } from "./middlewares/errorMiddleware";

const MONGO_URL: string = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL: string = "http://localhost:3000";
const port: number = 8000;

mongoose.connect(MONGO_URL);

const app: Express = express();

// The middleware function to allow cross-origin requests from the client URL.
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

// The middleware function to parse the request body.
app.use(express.json());

// Defining the path to the Open API specification file and parsing it.
const openApiPath = path.join(__dirname, "openapi.yaml");
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, "utf8"));

// Defining the Swagger UI options. Swagger UI renders the Open API specification file.
const swaggerOptions = {
  customSiteTitle: "Fake Stack Overflow API Documentation",
  customCss:
    ".swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }",
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: "none",
    showCommonExtensions: true,
  },
};

// The middleware function to serve the Swagger UI with the Open API specification file.
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, swaggerOptions)
);

// The middleware function to validate the request and response against the Open API specification.
app.use(
  middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
      "mongodb-id": /^[0-9a-fA-F]{24}$/,
    },
  })
);

// Route handlers
app.use("/tag", tagRouter);
app.use("/question", questionRouter);
app.use("/answer", answerRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Centralized error handling middleware
app.use(errorHandler);

const server: Server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// Gracefully shutdown the server and the database connection when the process is terminated.
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed.");
  });
  mongoose
    .disconnect()
    .then(() => {
      console.log("Database instance disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection:", err);
      process.exit(1);
    });
});

module.exports = server;
