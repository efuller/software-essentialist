import { PrismaClient, Student } from '@prisma/client';

export const prisma = new PrismaClient();

interface StudentPersistence {
  createStudent(name: string): any
  getAllStudents(): any;
  getStudentById(id: string): any
  getStudentSubmittedAssignments(id: string): any
  getStudentGrades(id: string): any
}

export class Database {
  public student: StudentPersistence;

  constructor(private readonly prismaClient: PrismaClient) {
    this.student = {
      createStudent: this.createStudent.bind(this),
      getAllStudents: this.getAllStudents.bind(this),
      getStudentById: this.getStudentById.bind(this),
      getStudentSubmittedAssignments: this.getStudentSubmittedAssignments.bind(this),
      getStudentGrades: this.getStudentGrades.bind(this)
    }
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
