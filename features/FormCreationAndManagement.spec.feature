Feature: Process of creating, saving, verifying, and deleting a form
  As a tester
  I want to create, save, verify, and delete a form
  So that I can test the functionality of the form

  @smoke
  Scenario: Create, Save, Verify, and Delete a Form
    Given I launch the browser and navigate the "<url>"
    When I am logged in as a tester
    When I fill out the form and save progress
    And I navigate to My Applications page
    Then I should see the saved form
    And I should delete the saved form

    Examples:
      | url     |
      | baseUrl |