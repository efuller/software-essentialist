import { prisma } from "./database";
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "./exceptions";

export class ClassesService {
  public async createClass(name: string) {
    const cls = await prisma.class.create({
      data: {
        name
      }
    });

    return cls;
  }

  public async enrollStudentToClass(studentId: string, classId: string) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId
      }
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    // check if class exists
    const cls = await prisma.class.findUnique({
      where: {
        id: classId
      }
    });

    // check if student is already enrolled in class
    const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId
      }
    });

    if (duplicatedClassEnrollment) {
      throw new StudentAlreadyEnrolledException();
    }

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId,
        classId
      }
    });
  }
}