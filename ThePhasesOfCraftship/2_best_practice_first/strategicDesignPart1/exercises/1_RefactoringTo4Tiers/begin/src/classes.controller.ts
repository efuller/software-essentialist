import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";
import { prisma } from "./database";
import { isMissingKeys, isUUID, parseForResponse } from "./index";
import { ERROR_EXCEPTION } from "./constants";
import { ClassesService } from "./classes.service";

export class ClassesController {
  private readonly router: express.Router;

  constructor(
    private readonly classesService: ClassesService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupErrorHandler();
    this.setupRoutes();
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post('/classes', this.createClass);
    this.router.post('/classes/enroll', this.enrollStudentToClass);
    this.router.get('/classes/:id/assignments', this.getClassAssignments);
  }

  public getRouter() {
    return this.router;
  }

  private async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['name'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { name } = req.body;

      const cls = await this.classesService.createClass(name);

      res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      res.status(500).json({ error: ERROR_EXCEPTION.SERVER_ERROR, data: undefined, success: false });
    }
  }

  private async enrollStudentToClass(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['studentId', 'classId'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { studentId, classId } = req.body;

      // check if student exists
      const student = await prisma.student.findUnique({
        where: {
          id: studentId
        }
      });

      if (!student) {
        return res.status(404).json({ error: ERROR_EXCEPTION.STUDENT_NOT_FOUND, data: undefined, success: false });
      }

      // check if class exists
      const cls = await prisma.class.findUnique({
        where: {
          id: classId
        }
      });

      // check if student is already enrolled in class
      const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
        where: {
          studentId,
          classId
        }
      });

      if (duplicatedClassEnrollment) {
        return res.status(400).json({ error: ERROR_EXCEPTION.STUDENT_ALREADY_ENROLLED, data: undefined, success: false });
      }

      if (!cls) {
        return res.status(404).json({ error: ERROR_EXCEPTION.CLASS_NOT_FOUND, data: undefined, success: false });
      }

      const classEnrollment = await prisma.classEnrollment.create({
        data: {
          studentId,
          classId
        }
      });

      res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
    } catch (error) {
      next(error);
    }

  }

  private async getClassAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if(!isUUID(id)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      // check if class exists
      const cls = await prisma.class.findUnique({
        where: {
          id
        }
      });

      if (!cls) {
        return res.status(404).json({ error: ERROR_EXCEPTION.CLASS_NOT_FOUND, data: undefined, success: false });
      }

      const assignments = await prisma.assignment.findMany({
        where: {
          classId: id
        },
        include: {
          class: true,
          studentTasks: true
        }
      });

      res.status(200).json({ error: undefined, data: parseForResponse(assignments), success: true });
    } catch (error) {
      next(error);
    }
  }
}