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
      res.status(500).json({ error: ERROR_EXCEPTION.SERVER_ERROR, data: undefined, success: false });
    }
  }
}