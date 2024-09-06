import { prisma } from "./database";
import { StudentAssignmentNotFoundException } from "./exceptions";
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
}