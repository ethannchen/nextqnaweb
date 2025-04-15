Feature: post comments for an answer
As a user with read and write access to fake stack overflow
I want to comment for an answer if I am logged in
So that I can express my opinion, agreement or thanks, and help others identify helpful answers.

Scenario: Unable to comment on answers if a question does not have any answers
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    And clicks into this new question
    Then they should not see the "Add a comment" button for that question

Scenario: Successful comment on answer posts
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks into a question
    And The user clicks the "Add a comment" button
    And The user fills out the comment form
    And The user clicks the "Submit" button
    Then The user should see their comment under the answer

Scenario: Unable to comment if the user has not logged in
    Given The user has read access to the application "http://localhost:3000"
    And The user clicks into a question
    When The user clicks the "Add a comment" button
    Then The user should see an error message "You need to log in first."

Scenario: Unable to make empty comment on answer posts
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks into a question
    And The user clicks the "Add a comment" button
    And The user clicks the "Submit" button
    Then The user should see an error message "Comment cannot be empty."

Scenario: Unable to make comment longer than 500 characters on answer posts
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks into a question
    And The user clicks the "Add a comment" button
    And The user fills out the comment form with more than 500 characters
    And The user clicks the "Submit" button
    Then The user should see an error message "Comment cannot exceed 500 characters."