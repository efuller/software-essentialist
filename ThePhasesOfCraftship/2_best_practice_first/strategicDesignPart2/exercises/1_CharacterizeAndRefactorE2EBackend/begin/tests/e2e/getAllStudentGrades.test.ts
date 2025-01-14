import { defineFeature, loadFeature } from "jest-cucumber";
import * as crypto from "crypto";
import * as path from "node:path";
// @ts-ignore
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { app } from "../../src";
import { EnrolledStudent } from "../fixtures/types";
import { ClassBuilder } from "../builders/classBuilder";
import { EnrollStudentToClassBuilder } from "../builders/enrollStudentToClass.builder";
import { StudentBuilder } from "../builders/studentBuilder";
import { AssignmentBuilder } from "../builders/assignmentBuilder";
import { AssignAssignmentToStudentBuilder } from "../builders/assignAssignmentToStudent.builder";
import { StudentSubmitAssignmentBuilder } from "../builders/studentSubmitAssignment.builder";
import { Grade, GradeAssignmentBuilder, Grades } from "../builders/gradeAssignment.builder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getAllStudentGrades.feature")
);

// create a function that will return a random grade
function getRandomGrade(): Grade {
  const grades: Grades = ['A', 'B', 'C', 'D', 'F'];
  const grade = grades[Math.floor(Math.random() * grades.length)];
  return grade;
}

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Get all student grades from a student by their id', ({ given, when, then }) => {
    let gradedAssignmentsResponse: any = {};
    let enrolledStudent: EnrolledStudent;
    let submittedAssignments: any[];
    let gradedAssignments: any[];

    given('I have a student with multiple graded assignments', async () => {
      const classBuilder = new ClassBuilder();

      // enroll student into a class
      enrolledStudent = await new EnrollStudentToClassBuilder()
        .assignStudent(new StudentBuilder())
        .toClass(classBuilder)
        .build();

      // create multiple assignments for the class
      const assignment1 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();
      const assignment2 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();
      const assignment3 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();

      const insertables = [assignment1, assignment2, assignment3].map((assignment) => {
        return new AssignAssignmentToStudentBuilder()
          .forEnrolledStudent(enrolledStudent)
          .assignment(assignment)
          .build();
      });

      const assignedAssignments = await Promise.all(insertables);

      // submit multiple assignments
      const insertableAssignments = assignedAssignments.map((assignedAssignment) => {
        return new StudentSubmitAssignmentBuilder()
          .fromStudentAssignmentId(assignedAssignment.id)
          .build();
      });

      submittedAssignments = await Promise.all(insertableAssignments);

      const insertableGradedAssignments = submittedAssignments.map((submittedAssignment) => {
        return new GradeAssignmentBuilder()
          .forStudentAssignment(submittedAssignment)
          .withGrade(getRandomGrade())
          .build();
      });

      gradedAssignments = await Promise.all(insertableGradedAssignments);
    });

    when('I get all graded assignments for a student', async () => {
      gradedAssignmentsResponse = await request(app)
        .get(`/student/${enrolledStudent.student.id}/grades`);
    });

    then('I should see all the graded assignments for that student', () => {
      expect(gradedAssignmentsResponse.status).toBe(200);
      expect(gradedAssignmentsResponse.body.data).toHaveLength(gradedAssignments.length);
      expect(gradedAssignmentsResponse.body.data).toEqual(
        expect.arrayContaining(
          gradedAssignments.map((gradedAssignment) => {
            return expect.objectContaining({
              id: gradedAssignment.id,
              grade: gradedAssignment.grade,
            });
          })
        )
      );
    });
  });

  test('Get all submitted grades from a student by their id that doesn\'t exist', ({ given, when, then }) => {
    let gradedAssignmentsResponse: any = {};
    let enrolledStudent: EnrolledStudent;
    let submittedAssignments: any[];
    let gradedAssignments: any[];

    given('I have a student with multiple graded assignments', async () => {
      const classBuilder = new ClassBuilder();

      // enroll student into a class
      enrolledStudent = await new EnrollStudentToClassBuilder()
        .assignStudent(new StudentBuilder())
        .toClass(classBuilder)
        .build();

      // create multiple assignments for the class
      const assignment1 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();
      const assignment2 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();
      const assignment3 = await new AssignmentBuilder()
        .fromClass(enrolledStudent.newClass)
        .build();

      const insertables = [assignment1, assignment2, assignment3].map((assignment) => {
        return new AssignAssignmentToStudentBuilder()
          .forEnrolledStudent(enrolledStudent)
          .assignment(assignment)
          .build();
      });

      const assignedAssignments = await Promise.all(insertables);

      // submit multiple assignments
      const insertableAssignments = assignedAssignments.map((assignedAssignment) => {
        return new StudentSubmitAssignmentBuilder()
          .fromStudentAssignmentId(assignedAssignment.id)
          .build();
      });

      submittedAssignments = await Promise.all(insertableAssignments);

      const insertableGradedAssignments = submittedAssignments.map((submittedAssignment) => {
        return new GradeAssignmentBuilder()
          .forStudentAssignment(submittedAssignment)
          .withGrade(getRandomGrade())
          .build();
      });

      gradedAssignments = await Promise.all(insertableGradedAssignments);
    });

    when('I get all submitted assignments for a student that doesn\'t exist', async () => {
      const nonExistentStudentId = crypto.randomUUID();
      gradedAssignmentsResponse = await request(app)
        .get(`/student/${nonExistentStudentId}/grades`);
    });

    then('I should see an error message', () => {
      expect(gradedAssignmentsResponse.status).toBe(404);
      expect(gradedAssignmentsResponse.body.error).toBe('StudentNotFound');
    });
  });
});
