import { PrismaClient, Student } from '@prisma/client';

export const prisma = new PrismaClient();

interface StudentPersistence {
  createStudent(name: string): any;
  getAllStudents(): any;
  getStudentById(id: string): any;
  getStudentSubmittedAssignments(id: string): any;
  getStudentGrades(id: string): any;
}

interface AssignmentsPersistence {
  getAssignmentById(id: string): any;
  gradeAssignment(id: string, grade: string): any;
  createClassAssignment(classId: string, title: string): any;
  assignAssignmentToStudent(studentId: string, assignmentId: string): any
  submitStudentAssignment(id: string): any;
  updateStudentAssignment(id: string, grade: string): any;
  getStudentAssignmentById(id: string): any;
}

export class Database {
  public student: StudentPersistence;
  public assignments: AssignmentsPersistence;

  constructor(private readonly prismaClient: PrismaClient) {
    this.student = {
      createStudent: this.createStudent.bind(this),
      getAllStudents: this.getAllStudents.bind(this),
      getStudentById: this.getStudentById.bind(this),
      getStudentSubmittedAssignments: this.getStudentSubmittedAssignments.bind(this),
      getStudentGrades: this.getStudentGrades.bind(this)
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

  public async getStudentAssignmentById(id: string) {
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        id
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
