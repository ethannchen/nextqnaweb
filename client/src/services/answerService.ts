/**
 * This module defines the functions to interact with the REST APIs for the answers service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { AnswerType } from "../types/entityTypes";

/**
 * The base URL for the answers API
 */
const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

/**
 * The function calls the API to add a new answer for a question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question for which the answer is being added.
 * @param ans the answer object to be added.
 * @returns the response data from the API, which contains the answer object added.
 */
const addAnswer = async (qid: string, ans: AnswerType): Promise<AnswerType> => {
  const data = { qid: qid, ans: ans };
  try {
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
    if (res.status !== 200) {
      throw new Error("Error while creating a new answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

/**
 * Calls the API to toggle a vote for an answer.
 * If the email has already voted, it unvotes; otherwise, it upvotes.
 * @param aid - The ID of the answer to vote or unvote.
 * @param email - The username of the person voting.
 * @returns The updated answer from the API.
 */
const voteAnswer = async (aid: string, email: string): Promise<AnswerType> => {
  try {
    const res = await api.patch(`${ANSWER_API_URL}/${aid}/vote`, { email });
    if (res.status !== 200) {
      throw new Error("Error while voting on answer");
    }
    return res.data._doc;
  } catch (error) {
    console.error("Error voting on answer:", error);
    throw error;
  }
};

/**
 * Calls the API to add a comment to a specific answer.
 * @param aid - The ID of the answer to comment on.
 * @param comment - The comment object including text, commented_by (user ID), and comment_date_time.
 * @returns The updated answer from the API.
 */
const commentAnswer = async (
  aid: string,
  comment: {
    text: string;
    commented_by: string;
    comment_date_time: string;
  }
): Promise<AnswerType> => {
  try {
    const res = await api.post(`${ANSWER_API_URL}/${aid}/addComment`, comment);
    if (res.status !== 200) {
      throw new Error("Error while adding comment to answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export { addAnswer, voteAnswer, commentAnswer };
