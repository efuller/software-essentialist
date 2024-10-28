Feature: Enroll Student to Class

  As an administrator
  I want to be able to enroll a student to a class
  So that I can keep track of which students are in which classes

    Scenario: Successfully enroll a student to a class
        Given There is an existing student
        And there is an existing class
        When I send a request to enroll the student to the class
        Then the student should be enrolled to the class successfully

    Scenario: Enroll a student to a class that does not exist
        Given There is an existing student
        When I send a request to enroll the student to the class
        Then the student should not be enrolled to the class
