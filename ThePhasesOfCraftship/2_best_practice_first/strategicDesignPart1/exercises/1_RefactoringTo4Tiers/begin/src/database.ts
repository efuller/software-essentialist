import { PrismaClient } from '@prisma/client';
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "./exceptions";

export const prisma = new PrismaClient();

interface StudentPersistence {
  createStudent(name: string): any;
  getAllStudents(): any;
  getStudentById(id: string): any;
  getStudentSubmittedAssignments(id: string): any;
  getStudentGrades(id: string): any;
  isStudentEnrolledInClass(studentId: string, classId: string): any;
}

interface AssignmentsPersistence {
  getAssignmentById(id: string): any;
  gradeAssignment(id: string, grade: string): any;
  createClassAssignment(classId: string, title: string): any;
  assignAssignmentToStudent(studentId: string, assignmentId: string): any
  submitStudentAssignment(id: string): any;
  updateStudentAssignment(id: string, grade: string): any;
  getStudentAssignmentById(studentId: string, assignmentId: string): any;
}

interface ClassesPersistence {
  createClass(name: string): any;
  enrollStudentToClass(studentId: string, classId: string): any;
  getClassAssignments(classId: string): any;
  getClassById(id: string): any;
}

export class Database {
  public student: StudentPersistence;
  public assignments: AssignmentsPersistence;
  public classes: ClassesPersistence;

  constructor(private readonly prismaClient: PrismaClient) {
    this.student = {
      createStudent: this.createStudent.bind(this),
      getAllStudents: this.getAllStudents.bind(this),
      getStudentById: this.getStudentById.bind(this),
      getStudentSubmittedAssignments: this.getStudentSubmittedAssignments.bind(this),
      getStudentGrades: this.getStudentGrades.bind(this),
      isStudentEnrolledInClass: this.isStudentEnrolledInClass.bind(this)
    }

    this.assignments = {
      getAssignmentById: this.getAssignmentById.bind(this),
      gradeAssignment: this.gradeAssignment.bind(this),
      createClassAssignment: this.createClassAssignment.bind(this),
      assignAssignmentToStudent: this.assignAssignmentToStudent.bind(this),
      submitStudentAssignment: this.submitAssignment.bind(this),
      updateStudentAssignment: this.updateStudentAssignment.bind(this),
      getStudentAssignmentById: this.getStudentAssignmentById.bind(this)
    }

    this.classes = {
      createClass: this.createClass.bind(this),
      enrollStudentToClass: this.enrollStudentToClass.bind(this),
      getClassAssignments: this.getClassAssignments.bind(this),
      getClassById: this.getClassById.bind(this)
    }
  }

  public async isStudentEnrolledInClass(studentId: string, classId: string) {
    const classEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId
      }
    });

    return !!classEnrollment;
  }

  public async getClassById(id: string) {
    const cls = await prisma.class.findUnique({
      where: {
        id
      }
    });

    return cls;
  }

  public async createClass(name: string) {
    const cls = await prisma.class.create({
      data: {
        name
      }
    });

    return cls;
  }

  public async enrollStudentToClass(studentId: string, classId: string) {
    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId,
        classId
      }
    });
    return classEnrollment;
  }

  public async getClassAssignments(classId: string) {
    const cls = await prisma.class.findUnique({
      where: {
        id: classId
      }
    });

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId
      },
      include: {
        class: true,
        studentTasks: true
      }
    });
    return assignments;
  }

  public async getAssignmentById(id: string) {
    const assignment = await prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true
      },
      where: {
        id
      }
    });

    return assignment;
  }

  public async updateStudentAssignment(id: string, grade: string) {
    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        id
      },
      data: {
        grade,
      }
    });

    return studentAssignmentUpdated;
  }

  public async createClassAssignment(classId: string, title: string) {
    const assignment = await prisma.assignment.create({
      data: {
        classId,
        title
      }
    });

    return assignment;
  }

  public async assignAssignmentToStudent(studentId: string, assignmentId: string) {
    const studentAssignment = await prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      }
    });

    return studentAssignment;
  }

  public async submitAssignment(id: string) {
    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        id
      },
      data: {
        status: 'submitted'
      }
    });

    return studentAssignmentUpdated;
  }

  public async getStudentAssignmentById(studentId: string, assignmentId: string) {
    const studentAssignment = await prisma.studentAssignment.findFirst({
      where: {
        studentId,
        assignmentId
      }
    });
    return studentAssignment;
  }

  public async gradeAssignment(id: string, grade: string) {
    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        id
      },
      data: {
        grade,
      }
    });

    return studentAssignmentUpdated;
  }

  public async createStudent(name: string) {
    const student = await this.prismaClient.student.create({
      data: {
        name
      }
    });

    return student;
  }

  public async getAllStudents() {
    const students = await this.prismaClient.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return students;
  }

  public async getStudentById(id: string) {
    const student = await this.prismaClient.student.findUnique({
      where: {
        id
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true
      }
    });

    return student;
  }

  public async getStudentSubmittedAssignments(id: string) {
    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: 'submitted'
      },
      include: {
        assignment: true
      },
    });

    return studentAssignments;
  }

  public async getStudentGrades(id: string) {
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

    return studentAssignments;
  }
}
