/**
 * This file includes some example users used for populate database
 * and for testing
 * Since these users are not real users
 * We did not encode their password
 */
import { IUser } from "../scripts/script_types";

const user1: IUser = {
  username: "carly",
  email: "carly@test.com",
  password: "111111Aa",
};

const user2: IUser = {
  username: "ethan",
  email: "ethan@test.com",
  password: "111111Aa",
};

const user3: IUser = {
  username: "James",
  email: "james@test.com",
  password: "111111Aa",
};

const user4: IUser = {
  username: "Luka",
  email: "luka@test.com",
  password: "111111Aa",
};

const user5: IUser = {
  username: "Reaves",
  email: "reaves@test.com",
  password: "111111Aa",
};

export const users = [user1, user2, user3, user4, user5];
