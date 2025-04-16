Feature: Display answers to a question
As a user with read access to fake stack overflow
I want to see the answers to a question if that question has anwers
So that I can know the solution to that question

Scenario Outline: Show all answers in the question page 
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on question "<question>"
    Then The user should see all answers "<answer>" for that question in newest order

    Examples:
    |question | answer|
    |Object storage for a web application|Using GridFS to chunk and store content;Storing content as BLOBs in databases.|
    |Quick question about storage on android|Store data in a SQLLite database.|

Scenario: Show 0 answers when a question does not have any answer yet
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    When The user clicks into the newly added question
    Then The user should see "0 answers" for that question