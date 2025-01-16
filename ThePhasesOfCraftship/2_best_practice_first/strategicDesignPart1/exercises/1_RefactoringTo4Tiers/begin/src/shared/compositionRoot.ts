import express from "express";
import cors from "cors";
import { Server } from "http";
import 'express-async-errors';
import { Database, prisma } from "./database";
import { StudentController } from "../modules/students/student.controller";
import { StudentService } from "../modules/students/student.service";
import { errorHandler } from "./errorHandler";
import { ClassesController } from "../modules/classes/classes.controller";
import { ClassesService } from "../modules/classes/classes.service";
import { AssignmentsController } from "../modules/assignments/assignments.controller";
import { AssignmentsService } from "../modules/assignments/assignments.service";

export class CompositionRoot {
  private readonly port = process.env.PORT || 3000;
  private apiServer: Server | undefined;
  private readonly expressApp: express.Express;
  private running = false;
  private db: Database | undefined;
  private studentController: StudentController | undefined;
  private classesController: ClassesController | undefined;
  private assignmentsController: AssignmentsController | undefined;

  constructor() {
    this.expressApp = this.createExpressApp();
    this.setupDatabase();

    this.setupMiddleware();
    this.setupStudentController();
    this.setupClassesController();
    this.setupAssignmentsController();

    this.setupRoutes();
  }

  private setupRoutes() {
    if (!this.studentController) {
      throw new Error("Student controller not initialized");
    }

    if (!this.classesController) {
      throw new Error("Classes controller not initialized");
    }

    if (!this.assignmentsController) {
      throw new Error("Assignments controller not initialized");
    }

    this.expressApp.use(this.studentController.getRouter());
    this.expressApp.use(this.classesController.getRouter());
    this.expressApp.use(this.assignmentsController.getRouter());
  }

  private setupAssignmentsController() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const assignmentsService = new AssignmentsService(this.db);
    this.assignmentsController = new AssignmentsController(
      assignmentsService,
      errorHandler
    );
  }

  private setupClassesController() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const classesService = new ClassesService(this.db);
    this.classesController = new ClassesController(
      classesService,
      errorHandler
    );
  }

  private setupStudentController() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const studentService = new StudentService(this.db);
    this.studentController = new StudentController(
      studentService,
      errorHandler
    );
  }

  private setupDatabase() {
    this.db = new Database(prisma);
  }

  private setupMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(cors());
  }

  private createExpressApp() {
    return express();
  }

  async start() {
    return new Promise((resolve) => {
      this.apiServer = this.expressApp.listen(
        this.port,
        () => {
          const address = this.apiServer?.address();
          this.running = true;
          resolve(address);
        }
      );
    });
  }

  async stop() {
    if (!this.isRunning() || !this.apiServer) {
      return;
    }
    this.apiServer.close(() => {
      return new Promise((resolve) => {
        this.running = false;
        resolve(true);
      });
    });
  }

  isRunning() {
    return this.running;
  }
}