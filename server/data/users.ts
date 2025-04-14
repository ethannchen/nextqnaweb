import { IUser } from "../scripts/script_types";
import dotenv from "dotenv";
dotenv.config();

const user1: IUser = {
  username: "carly",
  email: "carly@test.com",
  password: process.env.TEST_USER_PW as string,
};

const user2: IUser = {
  username: "ethan",
  email: "ethan@test.com",
  password: process.env.TEST_USER_PW as string,
};

const user3: IUser = {
  username: "James",
  email: "james@test.com",
  password: process.env.TEST_USER_PW as string,
};

const user4: IUser = {
  username: "Luka",
  email: "luka@test.com",
  password: process.env.TEST_USER_PW as string,
};

const user5: IUser = {
  username: "Reaves",
  email: "reaves@test.com",
  password: process.env.TEST_USER_PW as string,
};

export const users = [user1, user2, user3, user4, user5];
