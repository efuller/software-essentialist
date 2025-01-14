import { defineFeature, loadFeature } from "jest-cucumber";
import * as crypto from "crypto";
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
import { StudentSubmitAssignmentBuilder } from "../builders/studentSubmitAssignment.builder";
import { ClassBuilder } from "../builders/classBuilder";
import { EnrolledStudent } from "../fixtures/types";
import { AssignAssignmentToStudentBuilder } from "../builders/assignAssignmentToStudent.builder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getAllStudentSubmittedAssignments.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Get all student submitted assignments for a student', ({ given, when, then }) => {
    let studentSubmitAssignmentResponse: any = {};
    let enrolledStudent: EnrolledStudent;
    let submittedAssignments: any[];

    given('I have a student with multiple submitted assignments', async () => {
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
    });

    when('I get all submitted assignments for the student', async () => {
     studentSubmitAssignmentResponse = await request(app)
       .get(`/student/${enrolledStudent.student.id}/assignments`);
    });

    then('I should see all submitted assignments for the student', () => {
      expect(studentSubmitAssignmentResponse.status).toBe(200);
      expect(studentSubmitAssignmentResponse.body.data).toHaveLength(3);
      expect(studentSubmitAssignmentResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: submittedAssignments[0].studentAssignmentId }),
          expect.objectContaining({ id: submittedAssignments[1].studentAssignmentId }),
          expect.objectContaining({ id: submittedAssignments[2].studentAssignmentId }),
        ])
      )
    });
  });

  test('Get all submitted assignments from a student by their id that doesn\'t exist', async ({ given, when, then }) => {
    let studentSubmitAssignmentResponse: any = {};
    let enrolledStudent: EnrolledStudent;

    given('I have a student with multiple submitted assignments', async () => {
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

      await Promise.all(insertableAssignments);
    });

    when('I get all submitted assignments for a student that doesn\'t exist', async () => {
      const nonExistentStudentId = crypto.randomUUID();

      studentSubmitAssignmentResponse = await request(app)
        .get(`/student/${nonExistentStudentId}/assignments`);
    });

    then('I should see an error', () => {
      expect(studentSubmitAssignmentResponse.status).toBe(404);
      expect(studentSubmitAssignmentResponse.body.error).toBe('StudentNotFound');
    });
  });
});
