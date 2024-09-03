import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";
import { prisma } from "./database";
import { isMissingKeys, isUUID, parseForResponse } from "./index";
import { ERROR_EXCEPTION } from "./constants";

export class AssignmentsController {
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
    this.router.post('/assignments', this.createClassAssignment);
    // this.router.post('/classes/enroll', this.enrollStudentToClass);
    this.router.get('/assignments/:id', this.getAssignmentById);
    this.router.post('/assignments/assign', this.assignAssignmentToStudent);
    this.router.post('/assignments/submit', this.submitAssignment);
    this.router.post('/assignments/grade', this.gradeAssignment);
  }

  public getRouter() {
    return this.router;
  }

  private async gradeAssignment(req: Request, res: Response, next: NextFunction) {
    try {

      if (isMissingKeys(req.body, ['id', 'grade'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { id, grade } = req.body;

      // validate grade
      if (!['A', 'B', 'C', 'D'].includes(grade)) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      // check if student assignment exists
      const studentAssignment = await prisma.studentAssignment.findUnique({
        where: {
          id
        }
      });

      if (!studentAssignment) {
        return res.status(404).json({ error: ERROR_EXCEPTION.ASSIGNMENT_NOT_FOUND, data: undefined, success: false });
      }

      const studentAssignmentUpdated = await prisma.studentAssignment.update({
        where: {
          id
        },
        data: {
          grade,
        }
      });

      res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async submitAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ['id'])) {
        return res.status(400).json({ error: ERROR_EXCEPTION.VALIDATION_ERROR, data: undefined, success: false });
      }

      const { id } = req.body;

      // check if student assignment exists
      const studentAssignment = await prisma.studentAssignment.findUnique({
        where: {
          id
        }
      });

      if (!studentAssignment) {
        return res.status(404).json({ error: ERROR_EXCEPTION.ASSIGNMENT_NOT_FOUND, data: undefined, success: false });
      }

      const studentAssignmentUpdated = await prisma.studentAssignment.update({
        where: {
          id
        },
        data: {
          status: 'submitted'
        }
      });

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

      // check if student exists
      const student = await prisma.student.findUnique({
        where: {
          id: studentId
        }
      });

      if (!student) {
        return res.status(404).json({ error: ERROR_EXCEPTION.STUDENT_NOT_FOUND, data: undefined, success: false });
      }

      // check if assignment exists
      const assignment = await prisma.assignment.findUnique({
        where: {
          id: assignmentId
        }
      });

      if (!assignment) {
        return res.status(404).json({ error: ERROR_EXCEPTION.ASSIGNMENT_NOT_FOUND, data: undefined, success: false });
      }

      const studentAssignment = await prisma.studentAssignment.create({
        data: {
          studentId,
          assignmentId,
        }
      });

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

      const assignment = await prisma.assignment.create({
        data: {
          classId,
          title
        }
      });

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
      const assignment = await prisma.assignment.findUnique({
        include: {
          class: true,
          studentTasks: true
        },
        where: {
          id
        }
      });

      if (!assignment) {
        return res.status(404).json({ error: ERROR_EXCEPTION.ASSIGNMENT_NOT_FOUND, data: undefined, success: false });
      }

      res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
      next(error);
    }
  }
}