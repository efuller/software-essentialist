import express, { Response, Request, NextFunction } from "express";

import { ErrorHandler } from "../../shared/errorHandler";
import { StudentService } from "./student.service";
import {
  CreateStudentDto,
  GetStudentByIdDto,
  GetStudentGradesDto,
  GetStudentSubmittedAssignmentsDto
} from "./student.dto";
import { ObjectUtils } from "../../shared/objectUtils";

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

  private async createStudent(req: Request, res: Response) {
    const dto = CreateStudentDto.fromRequestBody(req.body);

    const student = await this.studentService.createStudent(dto);

    res.status(201).json({ error: undefined, data: ObjectUtils.parseForResponse(student), success: true });
  }

  private async getAllStudents(req: Request, res: Response) {
    const students = await this.studentService.getAllStudents();
    res.status(200).json({ error: undefined, data: ObjectUtils.parseForResponse(students), success: true });
  }

  private async getStudentById(req: Request, res: Response) {
    const dto = GetStudentByIdDto.fromRequestParams(req.params);

    const student = await this.studentService.getStudentById(dto);

    res.status(200).json({ error: undefined, data: ObjectUtils.parseForResponse(student), success: true });
  }

  private async getStudentSubmittedAssignments(req: Request, res: Response) {
    const dto = GetStudentSubmittedAssignmentsDto.fromRequestParams(req.params);

    const studentAssignments = await this.studentService.getStudentSubmittedAssignments(dto);

    res.status(200).json({ error: undefined, data: ObjectUtils.parseForResponse(studentAssignments), success: true });
  }

  private async getStudentGrades(req: Request, res: Response) {
    const dto = GetStudentGradesDto.fromRequestParams(req.params);

    const studentAssignments = await this.studentService.getStudentGrades(dto);

    res.status(200).json({ error: undefined, data: ObjectUtils.parseForResponse(studentAssignments), success: true });
  }
}