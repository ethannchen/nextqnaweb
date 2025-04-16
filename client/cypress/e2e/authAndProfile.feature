Feature: User Authentication
  As a user
  I want to be able to sign up, log in, and manage my account
  So that I can access the application and personalize my experience

  Background:
    Given The application server is running at "http://localhost:3000"

  # ======== SIGNUP SCENARIOS ========
  Scenario: Successful user signup with valid credentials
    Given The user navigates to the homepage
    When The user clicks the "Login" button in the header
    And The user clicks "Create a new account"
    And The user fills out the signup form with valid details:
      | username | testuser123 |
      | email    | test@example.com |
      | password | Password123 |
      | confirmPassword | Password123 |
    And The user clicks the "Create Account" button
    Then The user should see a success message "Account created successfully!"
    And The user should be redirected to the Questions page after a brief delay

  Scenario Outline: Failed signup due to invalid input
    Given The user navigates to the homepage
    When The user clicks the "Login" button in the header
    And The user clicks "Create a new account"
    And The user fills the signup form with "<username>", "<email>", "<password>", and "<confirmPassword>"
    And The user clicks the "Create Account" button
    Then The user should see an error message containing "<errorMessage>"

    Examples:
      | username    | email           | password    | confirmPassword | errorMessage                    |
      | te          | test@example.com | Password123 | Password123     | Username must be between 3 and 30 characters |
      | testuser123 | invalid-email    | Password123 | Password123     | Please enter a valid email address |
      | testuser123 | test@example.com | pass        | pass            | Password must be at least 8 characters |
      | testuser123 | test@example.com | password123 | password123     | Password must contain at least one uppercase letter |
      | testuser123 | test@example.com | Password123 | DifferentPass   | Passwords do not match |

  # ======== LOGIN SCENARIOS ========
  Scenario: Successful login with valid credentials
    Given The user navigates to the homepage
    When The user clicks the "Login" button in the header
    And The user clicks "Create a new account"
    And The user fills out the signup form with valid details:
      | username | testuser123 |
      | email    | test@example.com |
      | password | Password123 |
      | confirmPassword | Password123 |
    And The user clicks the "Create Account" button
    And The user clicks the "Login" button in the header
    And The user enters valid login credentials:
      | email    | test@example.com |
      | password | Password123       |
    And The user clicks the "Login Now" button
    Then The user should be logged in successfully
    And The user should see their username "testuser123" in the header

  Scenario Outline: Failed login attempts with invalid credentials
    Given The user navigates to the homepage
    When The user clicks the "Login" button in the header
    And The user enters "<email>" and "<password>"
    And The user clicks the "Login Now" button
    Then The user should see an error message containing "<errorMessage>"

    Examples:
      | email          | password    | errorMessage                      |
      |                | 111111Aa    | Email is required                 |
      | invalid-email  | 111111Aa    | Please enter a valid email address |
      | nonexistent@test.com | 111111Aa | Invalid credentials      |
      | carly@test.com |             | Password is required              |

  # ======== LOGOUT SCENARIO ========
  Scenario: User logs out successfully
    Given The user is logged in
    When The user clicks the "Logout" link
    Then The user should be logged out
    And The user should be logged out successfully

  # ======== PROFILE SCENARIOS ========
  Scenario: View profile information
    Given The user is logged in
    When The user clicks on "Profile" in the sidebar
    Then The user should see their profile information
    And The profile should display the correct username
    And The profile should display the correct email

  Scenario: Edit profile successfully
    Given The user is logged in
    And The user is viewing their profile page
    When The user clicks the "Edit Profile" button
    And The user updates their bio to "This is my new bio"
    And The user clicks the "Save Changes" button
    Then The user should see a success message "Profile updated successfully!"
    And The user should be redirected to the profile page showing the updated bio

  Scenario: Change password successfully
    Given The user is logged in
    And The user is viewing their profile page
    When The user clicks the "Change Password" button
    And The user enters the following password information:
      | currentPassword | Testuser1       |
      | newPassword     | Testuser12 |
      | confirmPassword | Testuser12 |
    And The user clicks the "Update Password" button
    Then The user should see a success message "Password changed successfully!"
    And The user should be redirected to the profile page

  Scenario: Delete account confirmation required
    Given The user is logged in
    And The user is viewing their profile page
    When The user clicks the "Delete Account" button
    Then The user should be prompted to confirm deletion by typing "DELETE"
    And The "Delete My Account" button should be disabled
    When The user enters "DELETE" in the confirmation field
    Then The "Delete My Account" button should be enabled
    When The user clicks the "Delete My Account" button
    Then The user should be logged out
    And The user should be logged out successfully