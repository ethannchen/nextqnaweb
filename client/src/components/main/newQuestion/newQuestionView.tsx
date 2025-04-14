import "./newQuestionView.css";
import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewQuestion } from "../../../hooks/useNewQuestion";
import { NewQuestionProps } from "../../../types/pageTypes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

/**
 * The component renders the form for posting a new question.
 * It uses the useNewQuestion hook to manage the state of the form
 * and to save the new question to the database. After saving the
 * question, it calls the handleQuestions function to update the view.
 * @param props contains the handleQuestions function to update the view which renders the new question
 * @returns the NewQuestion component.
 */
const NewQuestion = ({ handleQuestions }: NewQuestionProps) => {
  const {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion(handleQuestions);

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <Box className="btn_indicator_container">
        <Button
          variant="contained"
          size="small"
          className="form_postBtn"
          onClick={postQuestion}
        >
          Post Question
        </Button>
        <Typography className="mandatory_indicator" variant="body2">
          * indicates mandatory fields
        </Typography>
      </Box>
    </Form>
  );
};

export default NewQuestion;
