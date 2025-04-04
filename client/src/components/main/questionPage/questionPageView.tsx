import "./questionPageView.css";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import { QuestionPageProps } from "../../../types/pageTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

/**
 * A container component that displays a list of questions
 * @param param0 the input props for the component -- the data to be displayed
 * and the functions to be called when the user interacts with the component
 * @returns a component that displays a list of questions
 */
const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}: QuestionPageProps) => {
  const { qlist } = useQuestionPage({ order, search });

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <Box id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
          />
        ))}
      </Box>
      {title_text === "Search Results" && !qlist.length && (
        <Typography variant="h6" className="bold_title right_padding">
          No Questions Found
        </Typography>
      )}
    </>
  );
};

export default QuestionPage;
