import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../../shared/errorHandler";
import { parseForResponse } from "../../index";
import { ClassesService } from "./classes.service";
import { CreateClassDto, EnrollStudentToClassDto, GetClassAssignmentsDto, GetClassByIdDto } from "./classes.dto";

export class ClassesController {
  private readonly router: express.Router;

  constructor(
    private readonly classesService: ClassesService,
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
    this.router.get('/classes/:id', this.getClassById.bind(this));
    this.router.post('/classes', this.createClass.bind(this));
    this.router.post('/classes/enroll', this.enrollStudentToClass.bind(this));
    this.router.get('/classes/:id/assignments', this.getClassAssignments.bind(this));
  }

  public getRouter() {
    return this.router;
  }

  private async getClassById(req: Request, res: Response) {
    const dto = GetClassByIdDto.fromRequestParams(req.params);

    const cls = await this.classesService.getClassById(dto);

    res.status(200).json({ error: undefined, data: parseForResponse(cls), success: true });
  }

  private async createClass(req: Request, res: Response, next: NextFunction) {
    const createClassDto = CreateClassDto.fromRequestBody(req.body);

    const cls = await this.classesService.createClass(createClassDto);

    res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
  }

  private async enrollStudentToClass(req: Request, res: Response, next: NextFunction) {
    const dto = EnrollStudentToClassDto.fromRequestBody(req.body);

    const classEnrollment = await this.classesService.enrollStudentToClass(dto);

    res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
  }

  private async getClassAssignments(req: Request, res: Response, next: NextFunction) {
    const dto = GetClassAssignmentsDto.fromRequestParams(req.params);

    const assignments = await this.classesService.getClassAssignments(dto);

    res.status(200).json({ error: undefined, data: parseForResponse(assignments), success: true });
  }
}