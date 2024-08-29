import express, { Response, Request, NextFunction } from "express";

import { ErrorHandler } from "./errorHandler";
import { isMissingKeys, parseForResponse } from "./index";
import { prisma } from "./database";
import { ERROR_EXCEPTION } from "./constants";

export class StudentController {
  private readonly router: express.Router;

  constructor(private errorHandler: ErrorHandler) {
    this.router = express.Router();
    this.setupErrorHandler();
    this.setupRoutes();
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post('/students', this.createStudent);
    this.router.get('/students', this.getAllStudents);
  }

  public getRouter() {
    return this.router;
  }

  private async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['name'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { name } = req.body;

      const student = await prisma.student.create({
        data: {
          name
        }
      });

      res.status(201).json({ error: undefined, data: parseForResponse(student), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await prisma.student.findMany({
        include: {
          classes: true,
          assignments: true,
          reportCards: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
    } catch (error) {
      next(error);
    }
  }
}