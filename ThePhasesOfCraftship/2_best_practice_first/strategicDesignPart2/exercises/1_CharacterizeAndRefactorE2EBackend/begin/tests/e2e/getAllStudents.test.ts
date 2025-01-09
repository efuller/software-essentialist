import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { resetDatabase } from "../fixtures/reset";
import { StudentBuilder } from "../builders/studentBuilder";
import { Student } from "@prisma/client";
// @ts-ignore
import request from "supertest";
import { app } from "../../src";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getAllStudents.feature")
)

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully get all students', ({ given, when, then }) => {
    let students: Student[];
    let getAllStudentsResponse: any = [];

    given('I have multiple students', async () => {
      students = await Promise.all([
        new StudentBuilder().build(),
        new StudentBuilder().build(),
        new StudentBuilder().build(),
      ]);
    });

    when('I send a request to get all students', async () => {
      getAllStudentsResponse = await request(app).get("/students");
    });

    then('I should see all students', () => {
      expect(getAllStudentsResponse.status).toBe(200);
      expect(getAllStudentsResponse.body.data.length).toBe(students.length);
      expect(getAllStudentsResponse.body.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: students[0].name, email: students[0].email }),
        expect.objectContaining({ name: students[1].name, email: students[1].email }),
        expect.objectContaining({ name: students[2].name, email: students[2].email }),
      ]));
    });
  });
});