import { Database } from "../../shared/database";
import { StudentNotFoundException } from "../../shared/exceptions";
import {
  CreateStudentDto,
  GetStudentByIdDto,
  GetStudentGradesDto,
  GetStudentSubmittedAssignmentsDto
} from "./student.dto";

export class StudentService {
  constructor(private readonly db: Database) {}

  public async createStudent(data: CreateStudentDto) {
    const student = await this.db.student.createStudent(data.name);

    return student;
  }

  public async getAllStudents() {
    const students = await this.db.student.getAllStudents();

    return students;
  }

  public async getStudentById(data: GetStudentByIdDto) {
    const student = await this.db.student.getStudentById(data.id);

    return student;
  }

  public async getStudentSubmittedAssignments(data: GetStudentSubmittedAssignmentsDto) {
    const student = await this.db.student.getStudentById(data.id);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const studentAssignments = await this.db.student.getStudentSubmittedAssignments(data.id);
    return studentAssignments;
  }

  public async getStudentGrades(data: GetStudentGradesDto) {
    const student = await this.db.student.getStudentById(data.id);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const studentGrades = await this.db.student.getStudentGrades(data.id);
    return studentGrades;
  }
}