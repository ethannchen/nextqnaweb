import { voteAnswer } from "../services/answerService";
import { useUser } from "../contexts/UserContext";
import { AnswerType } from "../types/entityTypes";

/**
 * Custom hook for handling answer votes
 * @returns An object containing the handleVote function
 */
export const useAnswerVote = () => {
  /** read current user from context */
  const currentUser = useUser();

  /**
   * Handles voting/unvoting on an answer
   * @param aid - The answer ID to vote on
   * @returns Promise<void>
   */
  const handleVote = async (aid: string): Promise<AnswerType | undefined> => {
    if (!currentUser) {
      console.log("Need to login first");
      return;
    }

    try {
      const updatedAnswer = await voteAnswer(aid, currentUser.email);
      return updatedAnswer;
    } catch (error) {
      console.error("Error toggling vote for answer:", error);
    }
  };

  return handleVote;
};
