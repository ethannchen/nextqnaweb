import { PageClassParams } from "../../../types/pageTypes";
import HomePageClass from "./home";
import TagPageClass from "./tag";
import NewQuestionPageClass from "./newQuestion";
import PageClass from ".";
import AnswerPageClass from "./answer";
import NewAnswerPageClass from "./newAnswer";

/**
 * build a corresponding page instance
 * @param param0 page name
 * @param parameters for the page class
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
    default:
      return page;
  }
}
