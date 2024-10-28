Feature: Get assignment by Id

  As an administrator
  I want to to be able to get an assignment by its id
  So that I can see the assignment's information

  Scenario: Successfully get assignment by Id
    Given I have a class named "Math 101"
    And I have an assignment with a name of "Homework 1"
    When I get the assignment by id "1"
    Then I should see the assignment's name "Homework 1"

  Scenario: Unsuccessfully get assignment by Id
    Given I have a class named "Math 101"
    And I have an assignment with a name of "Homework 1"
    When I get the assignment by id
    Then I should see an error message "Assignment not found"
