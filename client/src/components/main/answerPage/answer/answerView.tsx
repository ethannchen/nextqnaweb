import "./answerView.css";
import { AnswerProps } from "../../../../types/pageTypes";

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer
 * @returns the Answer component
 */
const Answer = ({ text, ansBy, meta }: AnswerProps) => {
  return (
    <div className="answer right_padding">
      <div id="answerText" className="answerText">
        {text}
      </div>
      <div className="answerAuthor">
        <div className="answer_author">{ansBy}</div>
        <div className="answer_question_meta">{meta}</div>
      </div>
    </div>
  );
};

export default Answer;
