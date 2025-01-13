import { AssignNewAssignmentToStudentBuilder } from "./assignNewAssignmentToStudentBuilder";
import { StudentBuilder } from "./studentBuilder";
import { AssignmentBuilder } from "./assignmentBuilder";
import { EnrollStudentToClassBuilder } from "./enrollStudentToClass.builder";
import { prisma } from "../../src/database";
import { AssignmentSubmission, Class, ClassEnrollment, Student, StudentAssignment } from "@prisma/client";
import { StudentSubmitAssignment } from "../fixtures/types";

export class StudentSubmitAssignmentBuilder {
  private assignNewAssignmentToStudentBuilder: AssignNewAssignmentToStudentBuilder | undefined;
  private studentAssignmentId: string | undefined;

  assignNewAssignmentToStudent(assignNewAssignmentToStudentBuilder: AssignNewAssignmentToStudentBuilder) {
    this.assignNewAssignmentToStudentBuilder = assignNewAssignmentToStudentBuilder;
    return this;
  }

  fromStudentAssignmentId(studentAssignmentId: string) {
    this.studentAssignmentId = studentAssignmentId;
    return this;
  }

  async build(): Promise<StudentSubmitAssignment | AssignmentSubmission> {
    if (this.assignNewAssignmentToStudentBuilder) {
      const studentWithAssignedAssignment = await this.assignNewAssignmentToStudentBuilder
        .forStudent(new StudentBuilder())
        .inClass(new EnrollStudentToClassBuilder())
        .withAssignment(new AssignmentBuilder())
        .build();

      const submittedAssignment = await prisma.assignmentSubmission.create({
        data: {
          studentAssignmentId: studentWithAssignedAssignment.assignedAssignment.id
        }
      });

      return {
        submittedAssignment,
        ...studentWithAssignedAssignment,
      }
    }

    if (this.studentAssignmentId) {
      const submittedAssignment = await prisma.assignmentSubmission.create({
        data: {
          studentAssignmentId: this.studentAssignmentId
        }
      });

      return submittedAssignment;
    }

    throw new Error('You must define either the student assignment or the student assignment id');
  }
}