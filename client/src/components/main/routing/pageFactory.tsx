import { PageClassParams } from "../../../types/pageTypes";
import HomePageClass from "./home";
import TagPageClass from "./tag";
import NewQuestionPageClass from "./newQuestion";
import PageClass from ".";
import AnswerPageClass from "./answer";
import NewAnswerPageClass from "./newAnswer";
import LoginPageClass from "./login";
import SignupPageClass from "./signup";
import ProfilePageClass from "./profile";
import ProfileEditPageClass from "./profileEdit";
import ChangePasswordPageClass from "./changePassword";
import DeleteAccountPageClass from "./deleteAccount";

/**
 * build a corresponding page instance
 * @param pageName - page name
 * @param params - parameters for the page class
 * @returns an object of page class
 */
export default function getPage({
  pageName,
  params,
}: {
  pageName: string;
  params: PageClassParams;
}): PageClass {
  let page: PageClass = new HomePageClass(params);
  switch (pageName) {
    case "home":
      return page;
    case "tag":
      page = new TagPageClass(params);
      return page;
    case "newQuestion":
      page = new NewQuestionPageClass(params);
      return page;
    case "answer":
      page = new AnswerPageClass(params);
      return page;
    case "newAnswer":
      page = new NewAnswerPageClass(params);
      return page;
    case "login":
      page = new LoginPageClass(params);
      return page;
    case "signup":
      page = new SignupPageClass(params);
      return page;
    case "profile":
      page = new ProfilePageClass(params);
      return page;
    case "profileEdit":
      page = new ProfileEditPageClass(params);
      return page;
    case "changePassword":
      page = new ChangePasswordPageClass(params);
      return page;
    case "deleteAccount":
      page = new DeleteAccountPageClass(params);
      return page;
    default:
      return page;
  }
}
