Feature: Get All Students

  As an administrator
  I want to to be able to get all students
  So that I can see all students in the system

  Scenario: Successfully get all students
    Given I have multiple students
    When I send a request to get all students
    Then I should see all students
