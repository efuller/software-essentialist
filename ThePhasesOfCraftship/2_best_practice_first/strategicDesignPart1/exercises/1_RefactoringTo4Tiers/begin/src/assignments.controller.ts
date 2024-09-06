import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";
import { prisma } from "./database";
import { isMissingKeys, isUUID, parseForResponse } from "./index";
import { ERROR_EXCEPTION } from "./constants";
import { AssignmentsService } from "./assignments.service";

export class AssignmentsController {
  private readonly router: express.Router;

  constructor(
    private readonly assignmentsService: AssignmentsService,
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
    this.router.post('/assignments', this.createClassAssignment.bind(this));
    this.router.get('/assignments/:id', this.getAssignmentById.bind(this));
    this.router.post('/assignments/assign', this.assignAssignmentToStudent.bind(this));
    this.router.post('/assignments/submit', this.submitAssignment.bind(this));
    this.router.post('/assignments/grade', this.gradeAssignment.bind(this));
  }

  public getRouter() {
    return this.router;
  }

  private async gradeAssignment(req: Request, res: Response, next: NextFunction) {
    if (isMissingKeys(req.body, ['id', 'grade'])) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const { id, grade } = req.body;

    if (!['A', 'B', 'C', 'D'].includes(grade)) {
      return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
    }

    const response = await this.assignmentsService.gradeAssignment(id, grade);

    res.status(200).json({ error: undefined, data: parseForResponse(response), success: true });
  }

  private async submitAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['id'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { id } = req.body;

      const studentAssignmentUpdated = await this.assignmentsService.submitAssignment(id);

      res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async assignAssignmentToStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { studentId, assignmentId, grade } = req.body;

      const studentAssignment = await this.assignmentsService.assignAssignmentToStudent(studentId, assignmentId);

      res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async createClassAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['classId', 'title'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { classId, title } = req.body;

      const assignment = await this.assignmentsService.createClassAssignment(classId, title);

      res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async getAssignmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if(!isUUID(id)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const assignment = await this.assignmentsService.getAssignmentById(id);

      res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
      next(error);
    }
  }
}