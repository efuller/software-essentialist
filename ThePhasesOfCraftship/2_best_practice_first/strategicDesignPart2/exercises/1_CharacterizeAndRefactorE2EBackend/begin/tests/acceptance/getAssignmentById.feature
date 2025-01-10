Feature: Get assignment by Id

  As an administrator
  I want to to be able to get an assignment by its id
  So that I can see the assignment's information

  Scenario: Successfully get assignment by Id
    Given I have an assignment
    When I get the assignment by id
    Then I should see the assignment's information

  Scenario: Unsuccessfully get assignment by Id
    Given I have an assignment
    When I get the assignment by an invalid id
    Then I should see an error message
