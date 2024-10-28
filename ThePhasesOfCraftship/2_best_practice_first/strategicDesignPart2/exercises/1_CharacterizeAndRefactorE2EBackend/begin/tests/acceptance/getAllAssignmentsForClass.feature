Feature: Get All Assignments For Class

  As a student
  I want to to be able to get all assignments for a class
  So that I can see what assignments are due

  Scenario: Get all assignments for class
    Given I have a class named "Math 101"
    And I have an assignment with a name of "Homework 1"
    And I have an assignment with a name of "Homework 2"
    When I get all assignments for the class "Math 101"
    Then I should see the assignment's name "Homework 1"
    And I should see the assignment's name "Homework 2"

  Scenario: Get all assignments for a class that doesn't exist
    Given I have a class named "Math 101"
    And I have an assignment with a name of "Homework 1"
    When I get all assignments for the class that doesn't exist
    Then I should see an error message "Class not found"
