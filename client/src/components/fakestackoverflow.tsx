import Header from "./header";
import Main from "./main/mainView";
import { useStackOverflow } from "../hooks/useFakeStackOverflow";

/**
 * The FakeStackOverflow component is the root component of the application.
 * It uses a custom hook useFakeStackOverflow to manage the application state.
 * @returns the root component of the application
 */
const FakeStackOverflow = () => {
  /**
   * Application state and handler functions obtained from the useStackOverflow hook
   * @type {Object} State and handlers for the application
   * @property {string} search - The current search query
   * @property {Function} setQuestionPage - Function to set the current question page
   * @property {Object} pageInstance - The current page instance being displayed
   * @property {Function} handleQuestions - Function to handle question-related actions
   * @property {Function} handleTags - Function to handle tag-related actions
   * @property {Function} handleLogin - Function to handle user login
   * @property {Function} handleLogout - Function to handle user logout
   * @property {Function} handleProfile - Function to handle profile-related actions
   */
  const {
    search,
    setQuestionPage,
    pageInstance,
    handleQuestions,
    handleTags,
    handleLogin,
    handleLogout,
    handleProfile,
  } = useStackOverflow();

  return (
    <>
      <Header
        search={search}
        setQuestionPage={setQuestionPage}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Main
        page={pageInstance}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
        handleProfile={handleProfile}
      />
    </>
  );
};

export default FakeStackOverflow;
