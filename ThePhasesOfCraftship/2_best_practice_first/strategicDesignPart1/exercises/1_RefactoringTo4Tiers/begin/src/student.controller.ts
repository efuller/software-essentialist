import express, { Response, Request, NextFunction } from "express";

import { ErrorHandler } from "./errorHandler";
import { isMissingKeys, isUUID, parseForResponse } from "./index";
import { ERROR_EXCEPTION } from "./constants";
import { StudentService } from "./student.service";

export class StudentController {
  private readonly router: express.Router;

  constructor(
    private readonly studentService: StudentService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post('/students', this.createStudent.bind(this));
    this.router.get('/students', this.getAllStudents.bind(this));
    this.router.get('/students/:id', this.getStudentById.bind(this));
    this.router.get('/students/:id/assignments', this.getStudentSubmittedAssignments.bind(this));
    this.router.get('/students/:id/grades', this.getStudentGrades.bind(this));
  }

  public getRouter() {
    return this.router;
  }

  private async createStudent(req: Request, res: Response, next: NextFunction) {
    if (isMissingKeys(req.body, ['name'])) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const { name } = req.body;

    const student = await this.studentService.createStudent(name);

    res.status(201).json({ error: undefined, data: parseForResponse(student), success: true });
  }

  private async getAllStudents(req: Request, res: Response, next: NextFunction) {
    const students = await this.studentService.getAllStudents();
    res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
  }

  private async getStudentById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if(!isUUID(id)) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const student = await this.studentService.getStudentById(id);

    res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
  }

  private async getStudentSubmittedAssignments(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if(!isUUID(id)) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const studentAssignments = await this.studentService.getStudentSubmittedAssignments(id);

    res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
  }

  private async getStudentGrades(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if(!isUUID(id)) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const studentAssignments = await this.studentService.getStudentGrades(id);

    res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
  }
}