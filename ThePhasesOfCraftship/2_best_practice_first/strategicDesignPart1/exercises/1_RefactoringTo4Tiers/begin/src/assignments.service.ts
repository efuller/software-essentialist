import { prisma } from "./database";
import { StudentAssignmentNotFoundException } from "./exceptions";

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
}