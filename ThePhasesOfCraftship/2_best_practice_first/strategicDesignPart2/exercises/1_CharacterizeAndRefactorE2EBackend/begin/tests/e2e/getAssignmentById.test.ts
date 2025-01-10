import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";
import { resetDatabase } from "../fixtures/reset";
import { Assignment } from "@prisma/client";
import { AssignmentBuilder } from "../builders/assignmentBuilder";
import { ClassBuilder } from "../builders/classBuilder";
import { app } from "../../src";
// @ts-ignore
import request from "supertest";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/getAssignmentById.feature")
)

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test('Successfully get assignment by Id', ({ given, when, then }) => {
    let assignmentsResponse: any = {};
    let assignment: Assignment;
    given('I have an assignment', async () => {
      const newClass = await new ClassBuilder().build();
      assignment = await new AssignmentBuilder()
        .fromClass(newClass)
        .build();
    });

    when('I get the assignment by id', async () => {
      assignmentsResponse = await request(app)
        .get(`/assignments/${assignment.id}`)
        .send();
    });

    then('I should see the assignment\'s information', () => {
      expect(assignmentsResponse.status).toBe(200);
    });
  });

  test('Unsuccessfully get assignment by Id', ({ given, when, then }) => {
    let assignmentsResponse: any = {};
    let assignment: Assignment;
    given('I have an assignment', async () => {
      const newClass = await new ClassBuilder().build();
      assignment = await new AssignmentBuilder()
        .fromClass(newClass)
        .build();
    });

    when('I get the assignment by an invalid id', async () => {
      assignmentsResponse = await request(app)
        .get(`/assignments/234`)
        .send();
    });

    then('I should see an error message', () => {
      expect(assignmentsResponse.status).toBe(400);
    });
  });
});