Feature: Assign Student to Assignment

  As a teacher
  I want to assign a student to an assignment
  So that I can grade their work

  Scenario: Successfully assign a student to an assignment
    Given I have a student enrolled to a class
    And There is an assignment in the class
    When I send a request to assign the student to the assignment
    Then The student should be assigned to the assignment successfully

  Scenario: Assign a student to an assignment they are already assigned to
    Given I have a student with an assignment
    When I send a second request to assign the student to the assignment
    Then The student should not be assigned to the assignment
