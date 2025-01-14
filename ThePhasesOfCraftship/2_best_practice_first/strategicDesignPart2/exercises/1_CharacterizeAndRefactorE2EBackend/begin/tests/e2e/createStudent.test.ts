import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
// @ts-ignore
import request from "supertest";
import { app } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/createStudent.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully create a student', ({given, when, then}) => {
    let requestBody: any = {};
    let response: any = {};

    given(/^I want to create a student named "(.*)" with email "(.*)"$/, (name, email) => {
      requestBody = {
        name,
        email
      }
    });

    when('I send a request to create a student', async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then('the student should be created successfully"', () => {
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(requestBody.name);
      expect(response.body.data.email).toBe(requestBody.email);
    });
  });

  test('Fail to create a student with no name', ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};

    given('I want to create a student with no name', () => {
      let requestBody: any = {
        email: "test@example.com"
      };
    });

    when('I send a request to create a student', async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then('the student should not be created', () => {
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe("ValidationError");
    });
  });

  test('Fail to create a student with no email', ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};

    given('I want to create a student with no email', () => {
      let requestBody: any = {
        name: "Autumn IsGreat"
      };
    });

    when('I send a request to create a student', async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then('the student should not be created', () => {
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe("ValidationError");
    });
  });
});