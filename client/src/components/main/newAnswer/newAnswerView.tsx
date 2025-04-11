import "./newAnswerView.css";
import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewAnswer } from "../../../hooks/useNewAnswer";
import { NewAnswerProps } from "../../../types/pageTypes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

/**
 * The component renders a form to post a new answer to a question.
 * It uses a hook to manage the state of the form and the submission of the answer.
 * When the form is submitted, the answer is saved to the database
 * and the handleAnswer function is called to render the new answer.
 * @param props contains the question id and the handleAnswer function to render the newly created answer
 * @returns the NewAnswer component
 */
const NewAnswer = ({ qid, handleAnswer }: NewAnswerProps) => {
  const { usrn, setUsrn, text, setText, usrnErr, textErr, postAnswer } =
    useNewAnswer(qid, handleAnswer);

  return (
    <Form>
      <Input
        title={"Username"}
        id={"answerUsernameInput"}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Box className="btn_indicator_container">
        <Button
          variant="contained"
          size="small"
          className="form_postBtn"
          onClick={postAnswer}
        >
          Post Answer
        </Button>
        <Typography className="mandatory_indicator" variant="body2">
          * indicates mandatory fields
        </Typography>
      </Box>
    </Form>
  );
};

export default NewAnswer;
