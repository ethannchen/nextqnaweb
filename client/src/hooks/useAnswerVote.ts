import { voteAnswer } from "../services/answerService";

export const useAnswerVote = () => {
  const currentUser = "carly"; //TODO: read the user from global state
  const handleVote = async (aid: string) => {
    console.log(aid);
    try {
      const updatedAnswer = await voteAnswer(aid, currentUser);
    } catch (error) {
      console.error("Error toggling vote for answer:", error);
    }
  };

  return handleVote;
};
