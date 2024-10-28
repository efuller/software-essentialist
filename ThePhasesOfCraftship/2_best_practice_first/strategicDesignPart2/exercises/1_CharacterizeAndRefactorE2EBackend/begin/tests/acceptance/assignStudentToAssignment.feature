Feature: Assign Student to Assignment

  As a teacher
  I want to assign a student to an assignment
  So that I can grade their work

  Scenario: Successfully assign a student to an assignment
    Given I have a student named "John Awesome"
    And I have an assignment named "Homework 1"
    When I send a request to assign the student to the assignment
    Then the student should be assigned to the assignment successfully

  Scenario: Assign a student to an assignment they are already assigned to
    Given I have a student named "John Awesome"
    And I have an assignment named "Homework 1"
    And I have assigned the student to the assignment
    When I send a request to assign the student to the assignment
    Then the student should not be assigned to the assignment
