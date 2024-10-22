Feature: Create Student

  As an administrator
  I want to create a student
  So that I can add them to a classroom

    Scenario: Successfully create a student
        Given I want to create a student named "Summer Awesome" with email "summer@example.com"
        When I send a request to create a student
        Then the student should be created successfully"

    Scenario: Fail to create a student with no name
        Given I want to create a student with no name
        When I send a request to create a student
        Then the student should not be created

    Scenario: Fail to create a student with no email
      Given I want to create a student with no email
      When I send a request to create a student
      Then the student should not be created
