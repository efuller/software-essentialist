import { prisma } from "../../src/database";

import { StudentBuilder } from "./studentBuilder";
import { ClassBuilder } from "./classBuilder";

export class EnrollStudentToClassBuilder {
  private studentBuilder: StudentBuilder | undefined;
  private classBuilder: ClassBuilder | undefined;

  assignStudent(studentBuilder: StudentBuilder) {
    this.studentBuilder = studentBuilder;
    return this;
  }

  toClass(classBuilder: ClassBuilder) {
    this.classBuilder = classBuilder;
    return this;
  }

  async build() {
    if (!this.studentBuilder) {
      throw new Error('You must define the student builder');
    }

    if (!this.classBuilder) {
      throw new Error('You must define the class builder')
    };

    const student = await this.studentBuilder.build();
    const newClass = await this.classBuilder.build();

    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId: student.id,
        classId: newClass.id
      },
    });
    return { student, newClass, classEnrollment };
  }
}