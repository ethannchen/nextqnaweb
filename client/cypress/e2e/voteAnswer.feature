Feature: vote and unvote for an answer
As a user with read and write access to fake stack overflow
I want to vote or unvote for an answer if I am logged in
So that I can indicate agreement and help others identify the most recommended answers.

Scenario: Unable to vote on answers if a question does not have any answers
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    And clicks into this new question
    Then they should not see the vote icon for that question

Scenario: Successful vote on answer posts
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks into a question
    Then they should see the vote icon as outlined for the answer they have not voted for
    And they should be able to click the vote icon and make the vote number increase by 1
    
Scenario: Successful unvote on answer posts
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user clicks into a question 
    And The user clicks the vote icon to vote for one answer
    And The user clicks to see all questions again
    When The user clicks into the same question
    Then they should see the vote icon as filled for the answer they have already voted for
    And they should be able to click the vote icon and make the vote number decrease by 1

Scenario: Unable to vote if the user has not logged in
    Given The user has read access to the application "http://localhost:3000"
    And The user clicks into a question
    When The user clicks on the vote icon for an answer
    Then The user should see an error message "You need to log in first."

Scenario: The answers should be displayed in the order of vote numbers and then by answer date
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    When The user clicks into a question with multiple answers
    Then The answers should be displayed in order of votes and then by date