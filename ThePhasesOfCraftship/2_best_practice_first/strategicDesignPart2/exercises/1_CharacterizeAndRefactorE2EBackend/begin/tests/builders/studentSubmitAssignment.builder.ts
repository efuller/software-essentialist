import { AssignNewAssignmentToStudentBuilder } from "./assignNewAssignmentToStudentBuilder";
import { StudentBuilder } from "./studentBuilder";
import { AssignmentBuilder } from "./assignmentBuilder";
import { EnrollStudentToClassBuilder } from "./enrollStudentToClass.builder";
import { prisma } from "../../src/database";

export class StudentSubmitAssignmentBuilder {
  private assignNewAssignmentToStudentBuilder: AssignNewAssignmentToStudentBuilder | undefined;

  assignNewAssignmentToStudent(assignNewAssignmentToStudentBuilder: AssignNewAssignmentToStudentBuilder) {
    this.assignNewAssignmentToStudentBuilder = assignNewAssignmentToStudentBuilder;
    return this;
  }

  async build() {
    if (!this.assignNewAssignmentToStudentBuilder) {
      throw new Error("AssignNewAssignmentToStudentBuilder is required");
    }

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
}