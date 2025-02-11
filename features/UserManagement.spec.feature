Feature: User Management

  @regression
  Scenario Outline: Complete user registration flow
    Given I launch the browser and navigate the "<url>"
    When I navigate to the user registration page
    Then I should see the user registration page
    When I create a user from "<dataFile>" using key "<userKey>"
    Then I should see a success message
    And I should return to the login page
    When I verify the email and set the password for "<email_key>" from "<dataFile>"
    Then I delete the account using "<email_key>" from file "<dataFile>"

    Examples:
      | url     | dataFile               | userKey  | email_key |
      | baseUrl | UserManagement_td.json | new_user | gmxIMAP   |
      | baseUrl | BundIDRegister_td.json | new_user | gmxIMAP   |