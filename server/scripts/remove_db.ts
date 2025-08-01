import mongoose from "mongoose";
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/**
 * Clears the connected database by dropping it entirely
 *
 * @returns A Promise that resolves when the database has been dropped
 */
const clearDatabase = async (): Promise<void> => {
  try {
    await db.dropDatabase();
    console.log("Database cleared");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    if (db) db.close();
  }
};

clearDatabase().catch((err) => {
  console.error("ERROR:", err);
  if (db) db.close();
});

console.log("Processing...");
