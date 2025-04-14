Feature: Adding new answers
    As a user with write access to Fake Stack Overflow
    I want to add a new answer to specific questions
    So that I can share my solution with the question poster and the community

Scenario: Unable to add a new answer if not logged in
    Given The user has read access to the application "http://localhost:3000"
    When The user clicks on a question
    And clicks "Answer Question" button
    Then The user should see an error message "You need to log in first."

Scenario: Created new answer should be displayed at the top of the answers page
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks on a question
    And clicks "Answer Question" button
    And fills the answer
    And clicks the "Post Answer" button
    Then the answers should be in newest order in the answers page

Scenario Outline: Add a new answer fail with missing fields
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks on a question
    And clicks "Answer Question" button
    And fill out the answer form with all necessary fields except the "<missingField>" field 
    And clicks the "Post Answer" button
    Then The user should see an error message "<errorMessage>"
  
    Examples:
      | missingField | errorMessage |
      | answer   | Answer text cannot be empty |

Scenario: Adding new answers to questions should make them active
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user clicks "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    And The user answers two existing questions and the new question
    And goes back to the "Questions" page
    When The user clicks the "Active" tab
    Then The user should see all questions in active order
