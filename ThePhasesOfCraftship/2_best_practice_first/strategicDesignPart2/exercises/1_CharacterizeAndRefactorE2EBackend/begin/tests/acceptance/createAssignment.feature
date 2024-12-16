Feature: Create Assignment

  As a teacher
  I want to create an assignment
  So that I can assign it to a class

  Scenario: Successfully create an assignment
    Given I have a class
    When I send a request to create an assignment
    Then the assignment should be created successfully

  Scenario: Create an assignment with no class
    Given I want to create an assignment
    When I send a request to create the assignment with no class
    Then the assignment should not be created
