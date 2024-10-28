Feature: Get All Student By Id

  As an administrator
  I want to to be able to get a student by their id
  So that I can see the student's information

  Scenario: Successfully get student by Id
    Given I have a student with a name of "John Doe"
    When I get the student by id "1"
    Then I should see the student's name "John Doe"

    Scenario: Unsuccessfully get student by Id
    Given I have a student with a name of "John Doe"
    When I get the student by id
    Then I should see an error message "Student not found"
