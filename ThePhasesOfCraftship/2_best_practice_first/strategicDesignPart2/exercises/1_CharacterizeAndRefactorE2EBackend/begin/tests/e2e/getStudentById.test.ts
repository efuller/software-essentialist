import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { resetDatabase } from "../fixtures/reset";
import { Student } from "@prisma/client";
import { StudentBuilder } from "../builders/studentBuilder";
// @ts-ignore
import request from "supertest";
import { app } from "../../src";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getStudentById.feature")
)

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully get student by Id', ({ given, when, then }) => {
    let getStudentByIdResponse: any = {};
    let student: Student;

    given('I have a student', async () => {
      student = await new StudentBuilder().build();
    });

    when('I get the student by id', async () => {
      getStudentByIdResponse = await request(app).get(`/students/${student.id}`);
    });

    then('I should see the student', () => {
      expect(getStudentByIdResponse.status).toBe(200);
      expect(getStudentByIdResponse.body.data).toEqual(expect.objectContaining({ name: student.name, email: student.email }));
    });
  });

  // // test('Unsuccessfully get student by Id', ({ given, when, then }) => {
  // //   let getStudentByIdResponse2: any = {};
  // //   let student2: Student;
  // //
  // //   given('I have a student', () => {
  // //     // student2 = await new StudentBuilder().build();
  // //     expect(true).toBe(true);
  // //   });
  // //
  // //   when('I get the student by an invalid id',async () => {
  // //     const test = '';
  // //     getStudentByIdResponse2 = await request(app).get(`/students/invalidId`)
  // //   });
  // //
  // //   then('I should see an error message', (arg0) => {
  // //     expect(getStudentByIdResponse2.status).toBe(422);
  // //   });
  // });
});