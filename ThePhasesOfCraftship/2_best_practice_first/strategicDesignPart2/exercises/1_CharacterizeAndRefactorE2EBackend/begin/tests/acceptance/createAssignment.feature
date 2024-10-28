Feature: Create Assignment

  As a teacher
  I want to create an assignment
  So that I can assign it to a class

  Scenario: Successfully create an assignment
    Given I have a class named "Math 101"
    And I want to create an assignment named "Homework 1"
    When I send a request to create an assignment
    Then the assignment should be created successfully

  Scenario: Create an assignment with no class
    Given I want to create an assignment name "Homework 2"
    And There is no class to assign the assignment to
    When I send a request to create a class
    Then the assignment should not be created
