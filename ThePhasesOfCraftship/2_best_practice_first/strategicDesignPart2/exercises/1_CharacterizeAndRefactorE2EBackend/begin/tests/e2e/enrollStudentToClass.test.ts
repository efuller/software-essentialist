import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { app } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";
// @ts-ignore
import request from "supertest";
import { ClassBuilder } from "../builders/classBuilder";
import { Class, Student } from "@prisma/client";
import { StudentBuilder } from "../builders/studentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/enrollStudentToClass.feature")
);

defineFeature(feature, (test) => {
  let assignmentCreatedResponse: any = {};

  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully enroll a student to a class', ({ given, and, when, then }) => {
    let studentEnrolledToClassResponse: any = {};
    let createdStudent: Student;
    let createdClass: Class;

    given('There is a student', async () => {
      createdStudent = await new StudentBuilder()
        .build();
    });

    and('There is a class', async () => {
      createdClass = await new ClassBuilder().withName().build();
    });

    when('I send a request to enroll the student to the class', async () => {
      studentEnrolledToClassResponse = await request(app).post("/class-enrollments").send({
        studentId: createdStudent.id,
        classId: createdClass.id,
      });
    });

    then('the student should be enrolled to the class successfully', () => {
      expect(studentEnrolledToClassResponse.status).toBe(201);
      expect(studentEnrolledToClassResponse.body.data.studentId).toBe(createdStudent.id);
      expect(studentEnrolledToClassResponse.body.data.classId).toBe(createdClass.id);
    });
  });

  test('Enroll a student to a class that does not exist', ({ given, when, then }) => {
    let studentEnrolledToClassResponse: any = {};
    let createdStudent: Student;

    given('There is a student', async () => {
      createdStudent = await new StudentBuilder()
        .build();
    });

    when('I send a request to enroll the student to a class that does not exist', async () => {
      studentEnrolledToClassResponse = await request(app).post("/class-enrollments").send({
        studentId: createdStudent.id,
        classId: 'non-existing-class-id',
      });
    });

    then('The student should not be enrolled to the class', () => {
      expect(studentEnrolledToClassResponse.status).toBe(404);
      expect(studentEnrolledToClassResponse.body.error).toBe('ClassNotFound');
    });
  });
});