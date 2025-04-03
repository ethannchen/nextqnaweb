Feature: Search questions by search string or tagname/s.
As a user with read access to fake stack overflow
I want to search for questions using keyword or tagnames
So that I can find similar questions that I am interested in and view their answers

Scenario: Search for a question using text content that does not exist
    Given The user can access the homepage "http://localhost:3000"
    When The user search for a question using text content that does not exist
    Then The user should see no questions displayed for that text

Scenario Outline: Search string in question text
    Given The user can access the homepage "http://localhost:3000"
    When The user search for a string text "<searchText>"
    Then The user should see corresponding question "<question>" in the result in newest order

    Examples:
    |searchText|question|
    |40 million | Object storage for a web application|
    |data remains  |  Quick question about storage on android|

Scenario Outline: Search a question by tag
    Given The user can access the homepage "http://localhost:3000"
    When The user search for a tag "<tag>"
    Then The user should see corresponding questions "<question>" in the result in newest order

    Examples:
    |tag| question|
    |react | Programmatically navigate using React router|
    |javascript | android studio save string shared preference, start activity and load the saved string;Programmatically navigate using React router|
    |android-studio | Quick question about storage on android; android studio save string shared preference, start activity and load the saved string|
    |shared-preferences| Quick question about storage on android; android studio save string shared preference, start activity and load the saved string |

Scenario: Search for a question using a tag that does not exist
    Given The user can access the homepage "http://localhost:3000"
    When The user search for a tag that does not exist
    Then The user should see no questions displayed for that tag

Scenario: Search by tag from new question page
    Given The user can access the homepage "http://localhost:3000"
    And The user clicks "Ask a Question" button
    When The user search for a tag in the search bar
    Then The user should see correct questions in the result in newest order

Scenario: Search by text from Tags page
    Given The user can access the homepage "http://localhost:3000"
    And The user goes to "Tags" page
    When The user search for a text in the search bar
    Then The user should see correct question in the result