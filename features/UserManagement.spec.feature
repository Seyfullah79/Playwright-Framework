Feature: User Management

  @regression
  Scenario Outline: Complete user registration flow
    And I navigate to "<url>"
    When I start the user registration process
    Then I should see the registration page
    And I create a new user using "<dataFile>" with key "<userKey>"
    Then I should see a success message
    And I should be redirected to the login page
    When I verify the email and set the password for "<email_key>" using "<dataFile>"
    Then I delete the account linked to "<email_key>" in "<dataFile>"

    Examples:
      | url     | dataFile               | userKey  | email_key |
      | baseUrl | UserManagement_td.json | new_user | gmxIMAP   |
      | baseUrl | BundIDRegister_td.json | new_user | gmxIMAP   |