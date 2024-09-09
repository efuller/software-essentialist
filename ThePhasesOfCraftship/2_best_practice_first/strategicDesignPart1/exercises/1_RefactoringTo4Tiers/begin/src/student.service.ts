import { prisma } from "./database";
import { StudentNotFoundException } from "./exceptions";

export class StudentService {
  public async createStudent(name: string) {
    const student = await prisma.student.create({
      data: {
        name
      }
    });

    return student;
  }

  public async getAllStudents() {
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

    return students;
  }

  public async getStudentById(id: string) {
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
      throw new StudentNotFoundException();
    }

    return student;
  }

  public async getStudentSubmittedAssignments(id: string) {
    const student = await prisma.student.findUnique({
      where: {
        id
      }
    });

    if (!student) {
      throw new StudentNotFoundException();
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

    return studentAssignments;
  }

  public async getStudentGrades(id: string) {
    const student = await prisma.student.findUnique({
      where: {
        id
      }
    });

    if (!student) {
      throw new StudentNotFoundException();
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

    return studentAssignments;
  }
}