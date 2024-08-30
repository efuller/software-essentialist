import express, { Response, Request, NextFunction } from "express";

import { ErrorHandler } from "./errorHandler";
import { isMissingKeys, isUUID, parseForResponse } from "./index";
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
    this.router.get('/students/:id', this.getStudentById);
    this.router.get('/students/:id/assignments', this.getStudentSubmittedAssignments);
    this.router.get('/students/:id/grades', this.getStudentGrades);
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

  private async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if(!isUUID(id)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }
      const student = await prisma.student.findUnique({
        where: {
          id
        },
        include: {
          classes: true,
          assignments: true,
          reportCards: true
        }
      });

      if (!student) {
        return res.status(404).json({ error: ERROR_EXCEPTION.STUDENT_NOT_FOUND, data: undefined, success: false });
      }

      res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async getStudentSubmittedAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if(!isUUID(id)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      // check if student exists
      const student = await prisma.student.findUnique({
        where: {
          id
        }
      });

      if (!student) {
        return res.status(404).json({ error: ERROR_EXCEPTION.STUDENT_NOT_FOUND, data: undefined, success: false });
      }

      const studentAssignments = await prisma.studentAssignment.findMany({
        where: {
          studentId: id,
          status: 'submitted'
        },
        include: {
          assignment: true
        },
      });

      res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
    } catch (error) {
      res.status(500).json({ error: ERROR_EXCEPTION.SERVER_ERROR, data: undefined, success: false });
    }
  }

  private async getStudentGrades(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if(!isUUID(id)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      // check if student exists
      const student = await prisma.student.findUnique({
        where: {
          id
        }
      });

      if (!student) {
        return res.status(404).json({ error: ERROR_EXCEPTION.STUDENT_NOT_FOUND, data: undefined, success: false });
      }

      const studentAssignments = await prisma.studentAssignment.findMany({
        where: {
          studentId: id,
          status: 'submitted',
          grade: {
            not: null
          }
        },
        include: {
          assignment: true
        },
      });

      res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
    } catch (error) {
      next(error);
    }
  }
}