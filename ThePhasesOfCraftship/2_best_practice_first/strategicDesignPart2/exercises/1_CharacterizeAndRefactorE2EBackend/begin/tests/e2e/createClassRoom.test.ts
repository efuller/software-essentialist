import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "node:path";

const feature = loadFeature(
  path.join(__dirname, "../acceptance/createClassRoom.feature")
);

defineFeature(feature, (test) => {
  test('Successfully create a class room', ({ given, when, then }) => {
    given(/^I want to create a class room named "(.*)"$/, (arg0) => {

    });

    when('I send a request to create a class room', () => {

    });

    then('the class room should be created successfully', () => {

    });
  });

  test('Fail to create a class room', ({ given, when, then }) => {
    given('I want to create a class room with no name', () => {

    });

    when('I send a request to create a class room', () => {

    });

    then('the class room should not be created', () => {

    });
  });
});