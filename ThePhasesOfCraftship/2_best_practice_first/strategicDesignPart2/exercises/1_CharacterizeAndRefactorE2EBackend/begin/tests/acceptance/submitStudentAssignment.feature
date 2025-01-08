Feature: Submit Student Assignment

  As a student
  I want to submit an assignment from a class
  So that I can get a grade

  Scenario: Successfully submit an assignment
    Given I have a student with an assignment
    When I send a request to submit the assignment
    Then the assignment should be submitted successfully

  Scenario: Submit and assignment that's already been submitted
    Given I have a student with a submitted assignment
    When I send a request to submit the same assignment
    Then the assignment should not be submitted
