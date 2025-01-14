# Begin

## How to get started?
- Install Git
- Install Node v16 or higher on your machine
- Git clone or fork this repo
- go to the begin project
- run `npm install` to install the required dependencies
- run `npm run start:dev` to set up database, seed it and start web server


## Aditional informations

- Under `src/tests/fixtures/` you'll find the `reset.ts` script. It contains a function you can use the reset database state after each test scenario.

As example, you can use it like on the snippet below:

```
afterEach(async () => {
    await resetDatabase();
  });
```

- In case you realize some routes don't properly handle business rules based on any acceptance test you have written, take the opportunity to improve the route instead adjusting the scenario to the code. In real life it's normal to find hidden bugs when you're writing tests to legacy code. Trust in your tests!

- Run `npm run tests:e2e` to run the tests

## Solution

Under the `end` directory, you'll find a solution to the exercise.

## Assignment

### Create at least one success and one failure test for each endpoint.

### Create acceptance criteria for the following endpoints:
- [x] Create a student (student created)
- [x] Create a class(room) (class created)
- [x] Assign/enroll student to class (student assigned to class)
- [x] Create assignment (assignment created)
- [x] Assign student to assignment (student assigned to assignment)
  - create student, create class, enroll student to class, create assignment, assign assignment to student
- [x] Student submits assignment (student submitted assignment)
  - create student, create class, enroll student to class, create assignment, assign assignment to student, student submits assignment
- [x] Grade student assignment (student assignment graded)
  - create student, create class, enroll student to class, create assignment, assign assignment to student, student submits assignment, grade student assignment
- [x] Get all students
- [x] Get student by id
- [x] Get assignment by id
- [x] Get all assignments for a class
- [x] Get all student submitted assignments
- [x] Get all students grades by student id