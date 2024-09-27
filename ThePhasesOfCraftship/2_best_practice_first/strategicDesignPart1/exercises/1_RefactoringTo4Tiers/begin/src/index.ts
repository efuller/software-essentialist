import express, { Request, Response } from 'express';
const cors = require('cors');
import 'express-async-errors';

import { StudentController } from "./modules/students/student.controller";
import { errorHandler } from './errorHandler';
import { ClassesController } from "./modules/classes/classes.controller";
import { AssignmentsController } from "./modules/assignments/assignments.controller";
import { AssignmentsService } from "./modules/assignments/assignments.service";
import { ClassesService } from "./modules/classes/classes.service";
import { StudentService } from "./modules/students/student.service";
import { Database, prisma } from "./database";

const db = new Database(prisma);
const studentService = new StudentService(db);
const studentController = new StudentController(studentService, errorHandler);

const classesService = new ClassesService(db);
const classesController = new ClassesController(classesService, errorHandler);

const assignmentsService = new AssignmentsService(db);
const assignmentsController = new AssignmentsController(
  assignmentsService,
  errorHandler
);

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
app.use(assignmentsController.getRouter());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
