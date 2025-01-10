Feature: Get All Student By Id

  As an administrator
  I want to to be able to get a student by their id
  So that I can see the student's information

  Scenario: Successfully get student by Id
    Given I have a student
    When I get the student by id
    Then I should see the student

#    Scenario: Unsuccessfully get student by Id
#    Given I have a student
#    When I get the student by an invalid id
#    Then I should see an error message
