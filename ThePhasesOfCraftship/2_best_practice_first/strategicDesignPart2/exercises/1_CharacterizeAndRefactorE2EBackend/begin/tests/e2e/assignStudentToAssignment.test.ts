import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { app } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";
// @ts-ignore
import request from "supertest";
import { ClassBuilder } from "../builders/classBuilder";
import { Assignment, Class, ClassEnrollment, Student, StudentAssignment } from "@prisma/client";
import { StudentBuilder } from "../builders/studentBuilder";
import { AssignmentBuilder } from "../builders/assignmentBuilder";
import { EnrollStudentToClassBuilder } from "../builders/enrollStudentToClass.builder";
import { AssignNewAssignmentToStudentBuilder } from "../builders/assignNewAssignmentToStudentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/assignStudentToAssignment.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully assign a student to an assignment', ({ given, and, when, then }) => {
    let studentAssignedToAssignmentResponse: any = {};
    let createdAssignment: Assignment;
    let classEnrollment: { classEnrollment: ClassEnrollment, student: Student, newClass: Class };

    given('I have a student enrolled to a class', async () => {
      classEnrollment = await new EnrollStudentToClassBuilder()
        .assignStudent(new StudentBuilder())
        .toClass(new ClassBuilder())
        .build();
    });

    and('There is an assignment in the class', async () => {
      createdAssignment = await new AssignmentBuilder()
        .fromClass(classEnrollment.newClass)
        .build();
    });

    when('I send a request to assign the student to the assignment', async () => {
      studentAssignedToAssignmentResponse = await request(app)
        .post('/student-assignments')
        .send({
          studentId: classEnrollment.student.id,
          assignmentId: createdAssignment.id,
        });
    });

    then('The student should be assigned to the assignment successfully', () => {
      expect(studentAssignedToAssignmentResponse).toBeDefined();
      expect(studentAssignedToAssignmentResponse.status).toBe(201);
      expect(studentAssignedToAssignmentResponse.body.data.studentId).toBe(classEnrollment.student.id);
      expect(studentAssignedToAssignmentResponse.body.data.assignmentId).toBe(createdAssignment.id);
    });
  });

  test('Assign a student to an assignment they are already assigned to', ({ given, and, when, then }) => {
    let studentAssignedToAssignmentResponse: any = {};
    let assignedAssignment: { assignment: Assignment, assignedAssignment: StudentAssignment, student: Student, newClass: Class, classEnrollment: ClassEnrollment };

    given('I have a student with an assignment', async () => {
      assignedAssignment = await new AssignNewAssignmentToStudentBuilder()
        .forStudent(new StudentBuilder())
        .inClass(new EnrollStudentToClassBuilder())
        .withAssignment(new AssignmentBuilder())
        .build();
    });

    when('I send a second request to assign the student to the assignment', async () => {
      studentAssignedToAssignmentResponse = await request(app)
        .post('/student-assignments')
        .send({
          studentId: assignedAssignment.student.id,
          assignmentId: assignedAssignment.assignment.id,
        });
    });

    then('The student should not be assigned to the assignment', () => {
      expect(studentAssignedToAssignmentResponse.status).toBe(409);
      expect(studentAssignedToAssignmentResponse.body.error).toBe('AlreadyAssignedAssignmentToStudent');
    });
  });
});