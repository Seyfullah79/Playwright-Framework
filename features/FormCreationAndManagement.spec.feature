Feature: Process of creating, saving, verifying, and deleting a form
  As a tester
  I want to create, save, verify, and delete a form
  So that I can test the functionality of the form functionality

  @smoke
  Scenario: Create, Save, Verify, and Delete a Form
    When I navigate to "<url>"
    And I am logged in as a tester
    When I fill out the form and save it
    And I navigate to the "My Applications" page
    Then I should see the saved form
    And I should be able to delete the saved form

  Examples:
    | url     |
    | baseUrl |
