import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";
import { prisma } from "./database";
import { isMissingKeys, parseForResponse } from "./index";
import { ERROR_EXCEPTION } from "./constants";

export class ClassesController {
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
    this.router.post('/classes', this.createClass);
    // this.router.get('/classes/enroll', this.enrollStudentToClass);
    // this.router.get('/classes/:id/assignments', this.getClassAssignments);
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

      const cls = await prisma.class.create({
        data: {
          name
        }
      });

      res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      res.status(500).json({ error: ERROR_EXCEPTION.SERVER_ERROR, data: undefined, success: false });
    }
  }
}