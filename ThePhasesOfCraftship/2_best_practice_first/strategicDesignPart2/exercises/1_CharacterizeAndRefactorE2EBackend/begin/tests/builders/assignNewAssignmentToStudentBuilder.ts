import { AssignmentBuilder } from "./assignmentBuilder";
import { StudentBuilder } from "./studentBuilder";
import { ClassBuilder } from "./classBuilder";
import { EnrollStudentToClassBuilder } from "./enrollStudentToClass.builder";
import { prisma } from "../../src/database";

export class AssignNewAssignmentToStudentBuilder {
    private studentBuilder?: StudentBuilder;
    private assignmentBuilder?: AssignmentBuilder;
    private classEnrollmentBuilder?: EnrollStudentToClassBuilder;

    forStudent(studentBuilder: StudentBuilder) {
        this.studentBuilder = studentBuilder;
        return this;
    }

    inClass(classEnrollmentBuilder: EnrollStudentToClassBuilder) {
        this.classEnrollmentBuilder = classEnrollmentBuilder;
        return this;
    }

    withAssignment(assignmentBuilder: AssignmentBuilder) {
        this.assignmentBuilder = assignmentBuilder;
        return this;
    }

    async build() {
        if (!this.studentBuilder) {
            throw new Error('You must define the student builder');
        }
        if (!this.assignmentBuilder) {
            throw new Error('You must define the assignment builder');
        }
        if (!this.classEnrollmentBuilder) {
            throw new Error('You must define the class enrollment builder');
        }

        const classEnrollment = await this.classEnrollmentBuilder
          .assignStudent(this.studentBuilder)
          .toClass(new ClassBuilder())
          .build();

        const assignment = await this.assignmentBuilder.fromClass(classEnrollment.newClass).build();

        const assignedAssignment = await prisma.studentAssignment.create({
            data: {
                studentId: classEnrollment.student.id,
                assignmentId: assignment.id
            }
        });

        return {
            assignedAssignment,
            assignment,
            ...classEnrollment
        }
    }
}