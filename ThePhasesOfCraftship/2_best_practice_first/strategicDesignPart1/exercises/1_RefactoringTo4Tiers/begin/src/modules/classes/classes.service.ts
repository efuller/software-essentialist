import { Database, prisma } from "../../database";
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "../../exceptions";
import { CreateClassDto, EnrollStudentToClassDto, GetClassAssignmentsDto, GetClassByIdDto } from "./classes.dto";

export class ClassesService {
  constructor(private readonly db: Database) {}

  public async getClassById(data: GetClassByIdDto) {
    const cls = await this.db.classes.getClassById(data.id);

    if (!cls) {
      throw new ClassNotFoundException();
    }

    return cls;
  }

  public async createClass(data: CreateClassDto) {
    const cls = await this.db.classes.createClass(data.name);

    return cls;
  }

  public async enrollStudentToClass(data: EnrollStudentToClassDto) {
    const student = await this.db.student.getStudentById(data.studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const cls = await this.db.classes.getClassById(data.classId);

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const duplicatedClassEnrollment = await this.db.student.isStudentEnrolledInClass(data.studentId, data.classId);

    if (duplicatedClassEnrollment) {
      throw new StudentAlreadyEnrolledException();
    }

    const classEnrollment = await this.db.classes.enrollStudentToClass(data.studentId, data.classId);
    return classEnrollment;
  }

  public async getClassAssignments(data: GetClassAssignmentsDto) {
    const id = data.classId;
    const cls = await this.db.classes.getClassById(id);

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const assignments = await this.db.classes.getClassAssignments(id);
    return assignments;
  }
}