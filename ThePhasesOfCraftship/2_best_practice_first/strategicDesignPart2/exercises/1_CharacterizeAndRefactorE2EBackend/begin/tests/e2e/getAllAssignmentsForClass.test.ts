import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import * as crypto from "crypto";
import { resetDatabase } from "../fixtures/reset";
import { Class } from "@prisma/client";
// @ts-ignore
import request from "supertest";
import { app } from "../../src";
import { ClassBuilder } from "../builders/classBuilder";
import { AssignmentBuilder } from "../builders/assignmentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getAllAssignmentsForClass.feature")
)

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Get all assignments for class', ({ given, when, then }) => {
    let assignmentsResponse: any = {};
    let newClass: Class;

    given('I have a class with multiple assignments', async () => {
      newClass = await new ClassBuilder().build();
      await Promise.all([
        await new AssignmentBuilder().fromClass(newClass).build(),
        await new AssignmentBuilder().fromClass(newClass).build(),
        await new AssignmentBuilder().fromClass(newClass).build(),
      ]);
    });

    when('I get all assignments for the class', async () => {
      assignmentsResponse = await request(app).get(`/classes/${newClass.id}/assignments`);
    });

    then('I should see all the assignments', () => {
      expect(assignmentsResponse.status).toBe(200);
      expect(assignmentsResponse.body.data).toHaveLength(3);
    });
  });

  test('Get all assignments for a class that doesn\'t exist', ({ given, when, then }) => {
    let assignmentsResponse: any = {};
    let newClass: Class;

    given('I have a class with multiple assignments', async () => {
      newClass = await new ClassBuilder().build();
      await Promise.all([
        await new AssignmentBuilder().fromClass(newClass).build(),
        await new AssignmentBuilder().fromClass(newClass).build(),
        await new AssignmentBuilder().fromClass(newClass).build(),
      ]);
    });

    when('I get all assignments for a class that doesn\'t exist', async () => {
      const uid = crypto.randomUUID();
      assignmentsResponse = await request(app).get(`/classes/${uid}/assignments`);
    });

    then('I should see an error message', () => {
      expect(assignmentsResponse.status).toBe(404);
    });
  });
});