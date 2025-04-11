/**
 * Custom hook to encapsulate the logic for rendering an answer,
 * including vote handling, tracking vote status, and login prompt.
 */

import { useEffect, useState } from "react";
import { AnswerProps } from "../types/pageTypes";
import { useUser } from "../contexts/UserContext";

/**
 * Hook to manage vote state and behavior for an answer component.
 *
 * @param {Object} params - The parameters for managing answer logic.
 * @param {number} params.votes - Initial vote count for the answer.
 * @param {string[]} params.voted_by - List of user emails who have voted for the answer.
 * @param {(aid: string) => Promise<AnswerType | undefined>} params.handleVote - Function to handle the vote action.
 * @param {string} params.aid - Answer ID.
 * @returns {{
 *   voteCount: number;
 *   hasVoted: boolean;
 *   openDialog: boolean;
 *   setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
 *   onVoteClick: () => Promise<void>;
 * }} - The hook returns vote state, dialog state, and handlers.
 */
export const useAnswerView = ({
  votes,
  voted_by,
  handleVote,
  aid,
}: Pick<AnswerProps, "votes" | "voted_by" | "handleVote" | "aid">) => {
  const currentUser = useUser();

  /** State to store the current vote count */
  const [voteCount, setVoteCount] = useState(votes);

  /** State to store the list of voters */
  const [voters, setVoters] = useState(voted_by);

  /** Whether the current user has voted for this answer */
  const [hasVoted, setHasVoted] = useState(
    currentUser ? voted_by.includes(currentUser.email) : false
  );

  /** Whether to show the login-required dialog */
  const [openDialog, setOpenDialog] = useState(false);

  // Update hasVoted state when user or voters list changes
  useEffect(() => {
    if (currentUser && voters) {
      setHasVoted(voters.includes(currentUser.email));
    } else {
      setHasVoted(false);
    }
  }, [voters, currentUser]);

  /**
   * Handles the vote button click.
   * - If user is not logged in, opens dialog.
   * - Otherwise, triggers the vote handler and updates state.
   */
  const onVoteClick = async () => {
    if (!aid) return;

    if (!currentUser) {
      setOpenDialog(true);
      return;
    }

    try {
      const updatedAnswer = await handleVote(aid);
      if (updatedAnswer) {
        setHasVoted(!hasVoted);
        setVoteCount(updatedAnswer.votes);
        setVoters(updatedAnswer.voted_by);
      }
    } catch (error) {
      console.error("Failed to handle vote:", error);
    }
  };

  return {
    voteCount,
    hasVoted,
    openDialog,
    setOpenDialog,
    onVoteClick,
  };
};
