Feature: Show Unanswered Questions 
As a user with read access to fake stack overflow
I want to see all questions in the database that is unanswered
So that I can try to answer those questions

    Scenario: Show all unanswered questions in newest order
        Given The user has write access to the application "http://localhost:3000"
        And The user has logged in
        And can see the homepage "All Questions"
        And The user has created a new question
        And The user has created another new question
        When The user clicks on the "Unanswered" tab
        Then The user should see all questions in the database that are unanswered in newest order
    
    Scenario: View questions in unanswered order after answering questions
        Given The user has write access to the application "http://localhost:3000"
        And The user has logged in
        And The user has created a new question
        And The user has created another new question
        And answers the new question
        When The user clicks on the "Unanswered" tab in the "Questions" page
        Then The user should see all questions in the database that are unanswered in the newest order
