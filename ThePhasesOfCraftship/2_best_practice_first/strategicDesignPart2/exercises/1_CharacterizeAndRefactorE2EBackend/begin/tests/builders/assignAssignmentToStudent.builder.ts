import { EnrolledStudent } from "../fixtures/types";
import { Assignment } from "@prisma/client";
import { prisma } from "../../src/database";

export class AssignAssignmentToStudentBuilder {
  private enrolledStudent?: EnrolledStudent;
  private newAssignment?: Assignment;

  forEnrolledStudent(enrolledStudent: EnrolledStudent) {
    this.enrolledStudent = enrolledStudent;
    return this;
  }

  assignment(assignment: Assignment) {
    this.newAssignment = assignment;
    return this;
  }

  async build() {
    if (!this.enrolledStudent) {
      throw new Error('You must define the enrolled student');
    }
    if (!this.newAssignment) {
      throw new Error('You must define the assignment');
    }

    const assignedAssignment = await prisma.studentAssignment.create({
      data: {
        studentId: this.enrolledStudent.student.id,
        assignmentId: this.newAssignment.id
      }
    });

    return assignedAssignment;
  }
}