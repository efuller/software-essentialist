Feature: Get All Student Submitted Assignments

  As a teacher
  I want to to be able to see all assignments that have been submitted by students
  So that I can grade them

  Scenario: Get all student submitted assignments for a student
    Given I have a student with multiple submitted assignments
    When I get all submitted assignments for the student
    Then I should see all submitted assignments for the student

  Scenario: Get all submitted assignments from a student by their id that doesn't exist
    Given I have a student with multiple submitted assignments
    When I get all submitted assignments for a student that doesn't exist
    Then I should see an error


