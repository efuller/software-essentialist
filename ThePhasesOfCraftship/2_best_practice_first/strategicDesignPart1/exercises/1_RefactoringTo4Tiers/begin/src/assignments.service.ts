import { prisma } from "./database";
import { StudentAssignmentNotFoundException, StudentNotFoundException } from "./exceptions";
import { ERROR_EXCEPTION } from "./constants";

export class AssignmentsService {
  public async gradeAssignment(id: string, grade: string) {
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        id
      }
    });

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

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

  public async submitAssignment(id: string) {
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        id
      }
    });

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

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

  public async assignAssignmentToStudent(studentId: string, assignmentId: string) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId
      }
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    // check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId
      }
    });

    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignment = await prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      }
    });

    return studentAssignment;
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

    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    return assignment;
  }
}