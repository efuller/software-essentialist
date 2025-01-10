Feature: Get All Assignments For Class

  As a student
  I want to to be able to get all assignments for a class
  So that I can see what assignments are due

  Scenario: Get all assignments for class
    Given I have a class with multiple assignments
    When I get all assignments for the class
    Then I should see all the assignments

  Scenario: Get all assignments for a class that doesn't exist
    Given I have a class with multiple assignments
    When I get all assignments for a class that doesn't exist
    Then I should see an error message
