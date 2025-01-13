import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
// @ts-ignore
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { AssignNewAssignmentToStudentBuilder } from "../builders/assignNewAssignmentToStudentBuilder";
import { StudentBuilder } from "../builders/studentBuilder";
import { AssignmentBuilder } from "../builders/assignmentBuilder";
import { EnrollStudentToClassBuilder } from "../builders/enrollStudentToClass.builder";
import { Assignment, AssignmentSubmission, Class, ClassEnrollment, Student, StudentAssignment } from "@prisma/client";
import { app } from "../../src";
import { StudentSubmitAssignment, StudentSubmitAssignmentBuilder } from "../builders/studentSubmitAssignment.builder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/submitStudentAssignment.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully submit an assignment', ({ given, when, then }) => {
    let studentSubmitAssignmentResponse: any = {};
    let studentAssignment: { assignment: Assignment, assignedAssignment: StudentAssignment, student: Student, newClass: Class, classEnrollment: ClassEnrollment };

    given('I have a student with an assignment', async () => {
      studentAssignment = await new AssignNewAssignmentToStudentBuilder()
        .forStudent(new StudentBuilder())
        .inClass(new EnrollStudentToClassBuilder())
        .withAssignment(new AssignmentBuilder())
        .build();
    });

    when('I send a request to submit the assignment', async () => {
      studentSubmitAssignmentResponse = await request(app)
        .post('/student-assignments/submit')
        .send({
          studentId: studentAssignment.student.id,
          assignmentId: studentAssignment.assignment.id,
        });
    });

    then('the assignment should be submitted successfully', () => {
      expect(studentSubmitAssignmentResponse.status).toBe(201);
    });
  });

  test('Submit and assignment that\'s already been submitted', ({ given, when, then }) => {
    let submittedAssignmentResponse: any = {};
    let submittedAssignment: StudentSubmitAssignment | AssignmentSubmission;

    given('I have a student with a submitted assignment', async () => {
      submittedAssignment = await new StudentSubmitAssignmentBuilder()
        .assignNewAssignmentToStudent(new AssignNewAssignmentToStudentBuilder())
        .build();
    });

    when('I send a request to submit the same assignment', async () => {
      if ("student" in submittedAssignment && "assignment" in submittedAssignment) {
        submittedAssignmentResponse = await request(app)
          .post('/student-assignments/submit')
          .send({
            studentId: submittedAssignment.student.id,
            assignmentId: submittedAssignment.assignedAssignment.assignmentId
          });
      }
    });

    then('the assignment should not be submitted', () => {
      expect(submittedAssignmentResponse.status).toBe(409);
    });
  });
});
