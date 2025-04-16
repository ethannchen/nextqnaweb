Feature: Display tags and questions associated with tags
As a user with read access to fake stack overflow
I want to see all the tags available, and questions that are associated with a tag
So that I can see questions by tag

Scenario Outline: Each tag should have correct number of questions
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks "Tags" page
    And The user clicks on tag "<tag>"
    Then The user should see <questionNumber> questions for that tag

    Examples:
    |tag| questionNumber|
    |react  |    1|
    |javascript|  2  |
    |android-studio|  2  |
    |shared-preferences |  2  |
    |storage   |   2   |
    |website   |  1    |

Scenario: Successfully add the tags when create a new question 
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user clicks on "Ask a Question"
    And fills out the necessary fields with tags
    And clicks the "Post Question" button
    When The user clicks "Tags" page
    Then The user should see the new tags from the new question existing

Scenario: All tags should exist in Tags page
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks "Tags" page
    Then The user should be able to see all tags existing

Scenario: All question should exist in Tags page
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks "Tags" page
    Then The user should be able to see all questions existing

Scenario Outline: Correct question should exist in tags
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks "Tags" page
    And The user clicks on tag "<tag>"
    Then they should be able to see question "<question>" in it

    Examples:
    |tag| question|
    |react|Programmatically navigate using React router|
    |storage|Quick question about storage on android; Object storage for a web application|

Scenario: Successfully create a new question with a new tag and finds the question through tag
    Given The user has write access to the application "http://localhost:3000"
    And The user has logged in
    And The user clicks on "Ask a Question"
    And fills out the necessary fields with new tags
    And clicks the "Post Question" button
    When The user clicks "Tags" page
    And The user clicks on the new tag name
    Then The user should see the new question in it

Scenario: Clicks on a tag and the tag should be displayed for the question
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks "Tags" page
    And The user clicks on tag "javascript"
    Then The user should see tag "javascript" displayed for the question

Scenario: Clicks on a tag in homepage and the questions related with the tag are displayed
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on a tag button
    Then The user should see questions related with the tag are displayed
