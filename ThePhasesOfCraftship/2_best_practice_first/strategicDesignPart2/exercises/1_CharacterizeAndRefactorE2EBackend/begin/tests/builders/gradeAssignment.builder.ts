import { AssignmentSubmission, GradedAssignment } from "@prisma/client";
import { prisma } from "../../src/database";

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type Grades = [Grade, Grade, Grade, Grade, Grade];

export class GradeAssignmentBuilder {
  private submittedAssignment: AssignmentSubmission | undefined;
  private grade: Grade | undefined;

  public forStudentAssignment(submittedAssignment: AssignmentSubmission): GradeAssignmentBuilder {
    this.submittedAssignment = submittedAssignment;
    return this;
  }

  public withGrade(grade: Grade): GradeAssignmentBuilder {
    this.grade = grade;
    return this;
  }

  public async build(): Promise<GradedAssignment> {
    if (!this.submittedAssignment) {
      throw new Error('Submitted assignment is required to build a grade assignment');
    }

    if (!this.grade) {
      throw new Error('Grade is required to build a grade assignment');
    }

    const gradedAssignment = await prisma.gradedAssignment.create({
      data: {
        grade: this.grade,
        assignmentSubmissionId: this.submittedAssignment.id,
      },
    });

    return gradedAssignment;
  }
}