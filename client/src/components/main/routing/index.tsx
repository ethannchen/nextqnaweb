import {
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  VoidFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";

/**
 * The type definitions for the input object of the PageClass constructor
 *
 * @interface PageClassProps
 */
export interface PageClassProps {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: OrderFunctionType;
  qid: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
  // Auth-related handlers
  handleLogin: VoidFunctionType;
  handleSignup: VoidFunctionType;
  handleLogout: VoidFunctionType;
  handleProfile: VoidFunctionType;
  handleEditProfile: VoidFunctionType;
  handleChangePassword: VoidFunctionType;
  handleDeleteAccount: VoidFunctionType;
}

/**
 * The base class for all pages that will be rendered in Main component.
 * This class is extended by all other page classes.
 *
 * All child classes must implement the getContent() method.
 * Pages that need to control the selected tab must implement the getSelected() method.
 *
 */
class PageClass {
  search: string; // The search query string
  title: string; // The title of the page
  setQuestionPage: PageSetterFunctionType; // The function to set current page with list of questions based on a filter
  questionOrder: string; // the order of the questions
  setQuestionOrder: OrderFunctionType; // the function to set the order of the questions
  qid: string; // the id of a question
  handleQuestions: VoidFunctionType; // the function to render the list of questions
  handleTags: VoidFunctionType; // the function to render the list of tags
  handleAnswer: IdFunctionType; // the function to render the answers page of a question
  clickTag: ClickTagFunctionType; // the function to handle the click event on a tag
  handleNewQuestion: VoidFunctionType; // the function to handle the creation of a new question
  handleNewAnswer: VoidFunctionType; // the function to handle the creation of a new answer
  // Auth-related handlers
  handleLogin: VoidFunctionType; // the function to navigate to the login page
  handleSignup: VoidFunctionType; // the function to navigate to the signup page
  handleLogout: VoidFunctionType; // the function to logout the user
  handleProfile: VoidFunctionType; // the function to navigate to the profile page
  handleEditProfile: VoidFunctionType; // the function to navigate to the profile edit page
  handleChangePassword: VoidFunctionType; // the function to navigate to the change password page
  handleDeleteAccount: VoidFunctionType; // the function to navigate to the delete account page

  /**
   * Creates an instance of PageClass.
   * Initializes all properties with values from the props object.
   *
   * @param {PageClassProps} props - The properties required to initialize the page
   */
  constructor(props: PageClassProps) {
    this.search = props.search;
    this.title = props.title;
    this.setQuestionPage = props.setQuestionPage;
    this.questionOrder = props.questionOrder;
    this.setQuestionOrder = props.setQuestionOrder;
    this.qid = props.qid;
    this.handleQuestions = props.handleQuestions;
    this.handleTags = props.handleTags;
    this.handleAnswer = props.handleAnswer;
    this.clickTag = props.clickTag;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
    // Auth-related handlers
    this.handleLogin = props.handleLogin;
    this.handleSignup = props.handleSignup;
    this.handleLogout = props.handleLogout;
    this.handleProfile = props.handleProfile;
    this.handleEditProfile = props.handleEditProfile;
    this.handleChangePassword = props.handleChangePassword;
    this.handleDeleteAccount = props.handleDeleteAccount;
  }

  /**
   * Returns the React content to be rendered for this page.
   * This method must be implemented by all child classes.
   *
   * @returns {React.ReactNode} The content to be rendered
   */
  getContent(): React.ReactNode {
    return null;
  }

  /**
   * Returns the identifier for the selected navigation item.
   * This method can be overridden by child classes that need to control the selected tab.
   *
   * @returns {string} The identifier of the selected navigation item
   */
  getSelected(): string {
    return "";
  }
}

export default PageClass;
