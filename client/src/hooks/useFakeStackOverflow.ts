import { useState } from "react";
import getPage from "../components/main/routing/pageFactory";

/**
 * Custom hook to manage the state of application's parent componet.
 * It returns the search query, page instance, and functions to handle the application navigation.
 * @param app The application instance.
 * @returns The search query, page instance, and functions to set the page to be displayed.
 */
export const useStackOverflow = () => {
  const [search, setSearch] = useState<string>("");
  const [mainTitle, setMainTitle] = useState<string>("All Questions");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");

  // Set the page to display the questions based on the search string
  const setQuestionPage = (search = "", title = "All Questions"): void => {
    setSearch(search);
    setMainTitle(title);
    setPageInstance(getPage({ pageName: "home", params }));
  };

  // Set the page to display all questions
  const handleQuestions = () => {
    setSearch("");
    setMainTitle("All Questions");
    setPageInstance(getPage({ pageName: "home", params }));
  };

  // Set the page to display the tags
  const handleTags = () => {
    setPageInstance(getPage({ pageName: "tag", params }));
  };

  // Set the page to display the answers to a question
  const handleAnswer = (qid: string) => {
    setQid(qid);
    setPageInstance(getPage({ pageName: "answer", params }));
  };

  // Set the page to display the questions based on the selected tag name
  const clickTag = (tname: string) => {
    setSearch("[" + tname + "]");
    setMainTitle(tname);
    setPageInstance(getPage({ pageName: "home", params }));
  };

  // Set the page to display the form to create a new question
  const handleNewQuestion = () => {
    setPageInstance(getPage({ pageName: "newQuestion", params }));
  };

  // Set the page to display the form to create a new answer
  const handleNewAnswer = () => {
    setPageInstance(getPage({ pageName: "newAnswer", params }));
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
  };

  /**
   * The pageInstance is used to decide which page should be displayed
   * in the current view.
   */
  const [pageInstance, setPageInstance] = useState(
    getPage({ pageName: "home", params })
  );

  /**
   * Set specific properties of the pageInstance before it is rendered.
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
  };
};
