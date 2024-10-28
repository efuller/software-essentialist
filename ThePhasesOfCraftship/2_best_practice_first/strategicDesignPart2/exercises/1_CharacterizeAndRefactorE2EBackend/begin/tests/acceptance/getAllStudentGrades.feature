Feature: Get All Student Submitted Assignments

  As a teacher
  I want to to be able to see all assignments that have been submitted by students
  So that I can grade them

  Scenario: Get all student submitted assignments for a student
    Given I have a class named "Math 101"
    And I have a student named "John Doe"
    And I have an assignment with a name of "Homework 1"
    And I have an assignment with a name of "Homework 2"
    And John Doe has submitted the assignment
    When I get all assignments for the class
    Then I should see the assignment "Homework 1" submitted by "John Doe"
    And I should see the assignment "Homework 2" not submitted by "John Doe"

  Scenario: Get all submitted assignments from a student by their id that doesn't exist
    Given I have a class named "Math 101"
    And I have a student named "John Doe"
    And I have an assignment with a name of "Homework 1"
    And John Doe has submitted the assignment
    When I get all submitted assignments for a student with an id of "123"
    Then I should see an error message "Student not found"


