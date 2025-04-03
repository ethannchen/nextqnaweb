Feature: Adding new questions
    As a user with write access to Fake Stack Overflow
    I want to add a new question to the application
    So that I can ask a question to the community

  Scenario: Add a new question successfully
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    Then The user should see the new question in the All Questions page with the metadata information
  
  Scenario Outline: Add a new question fail with missing fields
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fill out form with all necessary fields except the "<missingField>" field 
    And clicks the "Post Question" button
    Then The user should see an error message "<errorMessage>"
    And The user should see the "Post Question" button
  
    Examples:
      | missingField | errorMessage |
      | title  | Title cannot be empty | 
      | text   | Text cannot be empty |
      | tags  | Should have at least one tag |
      | user   | Username cannot be empty|
  
  Scenario: Add questions and verify their sequences in Unanswered page
    Given The user has write access to the application "http://localhost:3000"
    And The user asks three questions
    And The user answers the first question
    When The user goes to "Questions" page
    And clicks "Unanswered" tab
    Then The user should see two questions in newest order

  Scenario: Adds multiple questions one by one and verify them in All Questions
    Given The user has write access to the application "http://localhost:3000"
    And The user asks three questions
    When The user goes back to the home page "Fake Stack Overflow"
    Then The user should see all questions including new questions in newest order
    And The user clicks "Unanswered" tab
    And The user should see three questions in newest order
  
