Feature: Show Questions by ask date
As a user with read access to fake stack overflow
I want to see all questions in the database in most recently created or newest order
So that I can view the questions that were asked most recently

    Scenario: Show all questions in newest order by default
        Given The user can access the homepage "http://localhost:3000"
        When The user is on the homepage "All Questions"
        Then The user should see all questions in the database with the most recently created first
    
    Scenario Outline: Return to the Newest tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Newest" order
    Then The user should see all questions in the database with the most recently created first

    Examples:
      | currentOrder |
      | Active       |
      | Unanswered   |

  Scenario: Return to Newest after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    Then The user should see all questions in the database with the most recently created first

  Scenario: View questions in newest order after asking questions
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user has created a new question
    When The user goes back to the "Questions" page
    Then The user should see all questions in the database in new newest order