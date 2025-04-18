import { useState } from "react";
import getPage from "../components/main/routing/pageFactory";
import { useUserUpdate } from "../contexts/UserContext";

/**
 * Custom hook to manage the state of application's parent component.
 * It returns the search query, page instance, and functions to handle the application navigation.
 * @returns The search query, page instance, and functions to set the page to be displayed.
 */
export const useStackOverflow = () => {
  /** The current search query string */
  const [search, setSearch] = useState<string>("");
  /** The main title displayed on the current page */
  const [mainTitle, setMainTitle] = useState<string>("All Questions");
  /** The current ordering of questions (newest, active, etc.) */
  const [questionOrder, setQuestionOrder] = useState("newest");
  /** The ID of the current question when viewing a specific question */
  const [qid, setQid] = useState("");
  /** Function to update user context data */
  const updateUser = useUserUpdate();

  /**
   * Sets the page to display questions based on a search string and title.
   *
   * @param {string} [search=""] - The search query string
   * @param {string} [title="All Questions"] - The title to display on the page
   * @returns {void}
   */
  const setQuestionPage = (search = "", title = "All Questions"): void => {
    setSearch(search);
    setMainTitle(title);
    setPageInstance(getPage({ pageName: "home", params }));
  };

  /**
   * Sets the page to display all questions.
   * Clears any search filters and resets the title.
   *
   * @returns {void}
   */
  const handleQuestions = () => {
    setSearch("");
    setMainTitle("All Questions");
    setPageInstance(getPage({ pageName: "home", params }));
  };

  /**
   * Sets the page to display all tags.
   *
   * @returns {void}
   */
  const handleTags = () => {
    setPageInstance(getPage({ pageName: "tag", params }));
  };

  /**
   * Sets the page to display answers for a specific question.
   *
   * @param {string} qid - The ID of the question to display
   * @returns {void}
   */
  const handleAnswer = (qid: string) => {
    setQid(qid);
    setPageInstance(getPage({ pageName: "answer", params }));
  };

  /**
   * Sets the page to display questions filtered by a specific tag.
   *
   * @param {string} tname - The name of the tag to filter by
   * @returns {void}
   */
  const clickTag = (tname: string) => {
    setSearch("[" + tname + "]");
    setMainTitle(tname);
    setPageInstance(getPage({ pageName: "home", params }));
  };

  /**
   * Sets the page to display the form for creating a new question.
   *
   * @returns {void}
   */
  const handleNewQuestion = () => {
    setPageInstance(getPage({ pageName: "newQuestion", params }));
  };

  /**
   * Sets the page to display the form for creating a new answer.
   *
   * @returns {void}
   */
  const handleNewAnswer = () => {
    setPageInstance(getPage({ pageName: "newAnswer", params }));
  };

  /**
   * Sets the page to display the login form.
   *
   * @returns {void}
   */
  const handleLogin = () => {
    setPageInstance(getPage({ pageName: "login", params }));
  };

  /**
   * Sets the page to display the signup form.
   *
   * @returns {void}
   */
  const handleSignup = () => {
    setPageInstance(getPage({ pageName: "signup", params }));
  };

  /**
   * Logs out the current user by clearing user data and returning to the home page.
   *
   * @returns {void}
   */
  const handleLogout = () => {
    // Clear the user data
    updateUser(null);
    // Return to home page
    handleQuestions();
  };

  /**
   * Sets the page to display the user profile.
   *
   * @returns {void}
   */
  const handleProfile = () => {
    setPageInstance(getPage({ pageName: "profile", params }));
  };

  /**
   * Sets the page to display the profile edit form.
   *
   * @returns {void}
   */
  const handleEditProfile = () => {
    setPageInstance(getPage({ pageName: "profileEdit", params }));
  };

  /**
   * Sets the page to display the change password form.
   *
   * @returns {void}
   */
  const handleChangePassword = () => {
    setPageInstance(getPage({ pageName: "changePassword", params }));
  };

  /**
   * Sets the page to display the delete account confirmation form.
   *
   * @returns {void}
   */
  const handleDeleteAccount = () => {
    setPageInstance(getPage({ pageName: "deleteAccount", params }));
  };

  /**
   * The parameters to be passed to the factory that creates a pageInstance.
   */
  const params = {
    search,
    title: mainTitle,
    setQuestionPage,
    questionOrder,
    setQuestionOrder,
    qid,
    handleQuestions,
    handleTags,
    handleAnswer,
    clickTag,
    handleNewQuestion,
    handleNewAnswer,
    // Auth-related handlers
    handleLogin,
    handleSignup,
    handleLogout,
    handleProfile,
    handleEditProfile,
    handleChangePassword,
    handleDeleteAccount,
  };

  /**
   * The pageInstance is used to decide which page should be displayed
   * in the current view.
   */
  const [pageInstance, setPageInstance] = useState(
    getPage({ pageName: "home", params })
  );

  /**
   * Update the pageInstance properties before rendering.
   * This ensures that any state changes are reflected in the current page.
   */
  pageInstance.search = search;
  pageInstance.questionOrder = questionOrder;
  pageInstance.qid = qid;
  pageInstance.title = mainTitle;

  return {
    search,
    setQuestionPage,
    pageInstance,
    handleQuestions,
    handleTags,
    handleLogin,
    handleLogout,
    handleProfile,
  };
};
