import { getMetaData } from "../../../utils";
import Answer from "./answer/answerView";
import AnswerHeader from "./header/headerView";
import "./answerPageView.css";
import QuestionBody from "./questionBody/questionBodyView";
import { AnswerPageProps } from "../../../types/pageTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";
import Button from "@mui/material/Button";
import { useAnswerVote } from "../../../hooks/useAnswerVote";
import LoginDialog from "../loginDialog/loginDialog";

/**
 * The component renders all the answers for a question.
 * It uses a hook to fetch the question and its answers.
 * @param props contains the qid, handleNewQuestion and handleNewAnswer functions
 * which are used by the new question and anwer forms
 * @returns the AnswerPage component
 */
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
}: AnswerPageProps) => {
  /**
   * use custom hook to manage the state of answer page
   */
  const { question, openDialog, setOpenDialog, onAnswerQuestionClick } =
    useAnswerPage(qid, handleNewAnswer);

  /**
   * use custom hook to manage the state of voting for an answer
   */
  const handleVote = useAnswerVote();

  /**
   * do not render this component if question is null
   */
  if (!question) {
    return null;
  }

  return (
    <>
      <AnswerHeader
        ansCount={question.answers.length}
        title={question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <QuestionBody
        views={question.views}
        text={question.text}
        askby={question.asked_by}
        meta={getMetaData(new Date(question.ask_date_time))}
      />
      {question.answers.map((a, idx) => {
        return (
          <Answer
            aid={a._id}
            key={idx}
            text={a.text}
            ansBy={a.ans_by}
            meta={getMetaData(new Date(a.ans_date_time))}
            votes={a.votes}
            voted_by={a.voted_by}
            handleVote={handleVote}
            comments={a.comments}
          />
        );
      })}
      <Button
        size="small"
        variant="contained"
        className="ansButton"
        onClick={onAnswerQuestionClick}
      >
        Answer Question
      </Button>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
};

export default AnswerPage;
