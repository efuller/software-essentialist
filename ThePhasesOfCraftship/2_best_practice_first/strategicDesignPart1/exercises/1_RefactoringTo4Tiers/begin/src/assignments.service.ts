import { Database, prisma } from "./database";
import { StudentAssignmentNotFoundException, StudentNotFoundException } from "./exceptions";

export class AssignmentsService {
  constructor(private readonly db: Database) {}

  public async gradeAssignment(id: string, grade: string) {
    const studentAssignment = await this.db.assignments.getStudentAssignmentById(id);

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignmentUpdated = await this.db.assignments.updateStudentAssignment(id, grade);

    return studentAssignmentUpdated;
  }

  public async submitAssignment(id: string) {
    const studentAssignment = await this.db.assignments.getStudentAssignmentById(id);

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignmentUpdated = await this.db.assignments.submitStudentAssignment(id);

    return studentAssignmentUpdated;
  }

  public async assignAssignmentToStudent(studentId: string, assignmentId: string) {
    const student = await this.db.student.getStudentById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await this.db.assignments.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignment = await this.db.assignments.assignAssignmentToStudent(studentId, assignmentId);

    return studentAssignment;
  }

  public async createClassAssignment(classId: string, title: string) {
    const assignment = await this.db.assignments.createClassAssignment(classId, title);

    return assignment;
  }

  public async getAssignmentById(id: string) {
    const assignment = await this.db.assignments.getAssignmentById(id);

    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    return assignment;
  }
}