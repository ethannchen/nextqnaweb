import React from "react";
import PageClass from ".";
import TagPage from "../tagPage/tagPageView";

/**
 * TagPageClass is a class that extends PageClass and returns the TagPage component.
 */
export default class TagPageClass extends PageClass {
  /**
   * Renders the TagPage component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered TagPage component
   */
  getContent(): React.ReactNode {
    return (
      <TagPage
        clickTag={this.clickTag}
        handleNewQuestion={this.handleNewQuestion}
      />
    );
  }

  /**
   * Returns the identifier for the selected navigation item.
   *
   * @returns {string} "t" for tag page
   */
  getSelected(): string {
    return "t";
  }
}
