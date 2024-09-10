import { Database } from "./database";
import { StudentNotFoundException } from "./exceptions";

export class StudentService {
  constructor(private readonly db: Database) {}

  public async createStudent(name: string) {
    const student = await this.db.student.createStudent(name);

    return student;
  }

  public async getAllStudents() {
    const students = await this.db.student.getAllStudents();

    return students;
  }

  public async getStudentById(id: string) {
    const student = await this.db.student.getStudentById(id);

    return student;
  }

  public async getStudentSubmittedAssignments(id: string) {
    const student = await this.db.student.getStudentById(id);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const studentAssignments = await this.db.student.getStudentSubmittedAssignments(id);
    return studentAssignments;
  }

  public async getStudentGrades(id: string) {
    const student = await this.db.student.getStudentById(id);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const studentGrades = await this.db.student.getStudentGrades(id);
    return studentGrades;
  }
}