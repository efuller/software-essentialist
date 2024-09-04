import express, { Request, Response } from 'express';
const cors = require('cors');

import { StudentController } from "./student.controller";
import { errorHandler } from './errorHandler';
import { ClassesController } from "./classes.controller";
import { AssignmentsController } from "./assignments.controller";

const studentController = new StudentController(errorHandler);
const classesController = new ClassesController(errorHandler);
const assignentsController = new AssignmentsController(errorHandler);

const app = express();
app.use(express.json());
app.use(cors());

export function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

export function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

export function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

// POST student created
app.use(studentController.getRouter());
app.use(classesController.getRouter());
app.use(assignentsController.getRouter());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
