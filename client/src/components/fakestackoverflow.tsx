import Header from "./header";
import Main from "./main/mainView";
import { useStackOverflow } from "../hooks/useFakeStackOverflow";

/**
 * The FakeStackOverflow component is the root component of the application.
 * It uses a custom hook useFakeStackOverflow to manage the application state.
 * @returns the root component of the application
 */
const FakeStackOverflow = () => {
  const { search, setQuestionPage, pageInstance, handleQuestions, handleTags } =
    useStackOverflow();

  return (
    <>
      <Header search={search} setQuestionPage={setQuestionPage} />
      <Main
        page={pageInstance}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
    </>
  );
};

export default FakeStackOverflow;
