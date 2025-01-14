import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { app } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";
// @ts-ignore
import request from "supertest";
import { ClassBuilder } from "../builders/classBuilder";
import { Class } from "@prisma/client";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/createAssignment.feature")
);

defineFeature(feature, (test) => {
  let assignmentCreatedResponse: any = {};

  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successfully create an assignment', ({ given, when, then }) => {
    let createdClass: Class;

    given('I have a class', async () => {
      createdClass = await (new ClassBuilder()).withName().build();
    });

    when('I send a request to create an assignment', async () => {
      assignmentCreatedResponse = await request(app).post("/assignments").send({
        title: 'Assignment 1',
        classId: createdClass.id,
      });
    });

    then('the assignment should be created successfully', () => {
      expect(assignmentCreatedResponse.status).toBe(201);
      expect(assignmentCreatedResponse.body.data.title).toBe('Assignment 1');
    });
  });

  test('Create an assignment with no class', ({ given, and, when, then }) => {
    let createAssignmentCommand: any = {};

    given('I want to create an assignment', () => {
      createAssignmentCommand = {
        name: 'Assignment Two',
      };
    });

    when('I send a request to create the assignment with no class', async () => {
      assignmentCreatedResponse = await request(app).post("/assignments").send({
        title: 'Assignment 2',
      });
    });

    then('the assignment should not be created', () => {
      expect(assignmentCreatedResponse.status).toBe(400);
      expect(assignmentCreatedResponse.body.data).toBeUndefined();
      expect(assignmentCreatedResponse.body.error).toBe('ValidationError');
    });
  });
});