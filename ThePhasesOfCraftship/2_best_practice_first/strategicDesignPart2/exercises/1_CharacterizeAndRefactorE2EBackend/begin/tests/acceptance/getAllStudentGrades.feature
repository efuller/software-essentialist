Feature: Get All Student Graded Assignments

  As a teacher
  I want to to be able to see all the graded assignments for a student
  So that I can review them

  Scenario: Get all student grades from a student by their id
    Given I have a student with multiple graded assignments
    When I get all graded assignments for a student
    Then I should see all the graded assignments for that student

  Scenario: Get all submitted grades from a student by their id that doesn't exist
    Given I have a student with multiple graded assignments
    When I get all submitted assignments for a student that doesn't exist
    Then I should see an error message


