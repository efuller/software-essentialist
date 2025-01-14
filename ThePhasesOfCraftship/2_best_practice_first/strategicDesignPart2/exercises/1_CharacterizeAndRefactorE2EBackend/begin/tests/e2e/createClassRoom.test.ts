import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { app } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";
// @ts-ignore
import request from "supertest";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/createClassRoom.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully create a class room', ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};

    given(/^I want to create a class room named "(.*)"$/, (name) => {
      requestBody = {
        name,
      };
    });

    when('I send a request to create a class room', async () => {
      response = await request(app).post("/classes").send(requestBody);
    });

    then('the class room should be created successfully', () => {
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(requestBody.name);
    });
  });

  test('Fail to create a class room', ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    given('I want to create a class room with no name', () => {
      requestBody = {};
    });

    when('I send a request to create a class room', async () => {
      response = await request(app).post("/classes").send(requestBody);
    });

    then('the class room should not be created', () => {
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe("ValidationError");
    });
  });
});