import { prisma } from "./database";
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "./exceptions";
import { CreateClassDto, EnrollStudentToClassDto } from "./classes.dto";

export class ClassesService {
  public async createClass(data: CreateClassDto) {
    const cls = await prisma.class.create({
      data: {
        name: data.name
      }
    });

    return cls;
  }

  public async enrollStudentToClass(data: EnrollStudentToClassDto) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: data.studentId
      }
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    // check if class exists
    const cls = await prisma.class.findUnique({
      where: {
        id: data.classId
      }
    });

    // check if student is already enrolled in class
    const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId: data.studentId,
        classId: data.classId
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
        studentId: data.studentId,
        classId: data.classId
      }
    });
    return classEnrollment;
  }

  public async getClassAssignments(id: string) {
    const cls = await prisma.class.findUnique({
      where: {
        id
      }
    });

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId: id
      },
      include: {
        class: true,
        studentTasks: true
      }
    });
    return assignments;
  }
}