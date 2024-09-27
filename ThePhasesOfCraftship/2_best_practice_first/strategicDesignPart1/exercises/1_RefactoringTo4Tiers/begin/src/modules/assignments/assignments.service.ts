import { Database } from "../../database";
import { StudentAssignmentNotFoundException, StudentNotFoundException } from "../../exceptions";
import {
  AssignAssignmentToStudentDto,
  CreateClassAssignmentDto,
  GradeAssignmentDto,
  SubmitAssignmentDto
} from "./assignments.dto";

export class AssignmentsService {
  constructor(private readonly db: Database) {}

  public async gradeAssignment(data: GradeAssignmentDto) {
    const { studentId, assignmentId, grade } = data;
    const studentAssignment = await this.db.assignments.getStudentAssignmentById(studentId, assignmentId);

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignmentUpdated = await this.db.assignments.updateStudentAssignment(studentAssignment.id, grade);

    return studentAssignmentUpdated;
  }

  public async submitAssignment(data: SubmitAssignmentDto) {
    const { studentId, assignmentId } = data;
    const studentAssignment = await this.db.assignments.getStudentAssignmentById(studentId, assignmentId);

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignmentUpdated = await this.db.assignments.submitStudentAssignment(studentAssignment.id);

    return studentAssignmentUpdated;
  }

  public async assignAssignmentToStudent(data: AssignAssignmentToStudentDto) {
    const student = await this.db.student.getStudentById(data.studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await this.db.assignments.getAssignmentById(data.assignmentId);

    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const studentAssignment = await this.db.assignments.assignAssignmentToStudent(data.studentId, data.assignmentId);

    return studentAssignment;
  }

  public async createClassAssignment(data: CreateClassAssignmentDto) {
    const assignment = await this.db.assignments.createClassAssignment(data.classId, data.title);

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