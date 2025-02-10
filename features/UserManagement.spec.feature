Feature: User Registration, Email Confirmation, and Account Deletion

  In order to register and verify a new user account
  As a new user
  I want to register an account, confirm it via email, set a password, and delete the account.

  Background:
    Given I launch the browser and navigate to the login page
  @regression
  Scenario: Complete user registration flow
    When I navigate to the user registration page
    Then I should see the user registration page
    When I create a user from "<dataFile>" using key "<userKey>"
    Then I should see a success message
    And I should return to the login page
    When I fetch and process the email using "<email_key>" from file "<dataFile>"
    And I fill the password "<email_key>" from file "<dataFile>"
    When I delete the account using "<email_key>" from file "<dataFile>"
    Examples:
      | dataFile               | userKey  | email_key |
      | BundIDRegister_td.json | new_user | gmxIMAP   |
      | UserManagement_td.json | new_user | gmxIMAP   |



