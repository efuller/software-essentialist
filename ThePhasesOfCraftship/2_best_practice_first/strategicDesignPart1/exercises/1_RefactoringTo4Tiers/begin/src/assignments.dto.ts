import { isMissingKeys } from "./index";
import { InvalidRequestBodyException } from "./exceptions";

export class GradeAssignmentDto {
  private constructor(
    public readonly studentId: string,
    public readonly assignmentId: string,
    public readonly grade: string
  ) {}

  public static fromRequestBody(body: any): GradeAssignmentDto {
    if (isMissingKeys(body, ['studentId', 'assignmentId', 'grade'])) {
      throw new InvalidRequestBodyException(['studentId', 'assignmentId', 'grade']);
    }

    const { studentId, assignmentId, grade } = body;

    if (!['A', 'B', 'C', 'D'].includes(grade)) {
      throw new InvalidRequestBodyException(['grade']);
    }

    return new GradeAssignmentDto(studentId, assignmentId, grade);
  }
}

export class SubmitAssignmentDto {
  private constructor(
    public readonly studentId: string,
    public readonly assignmentId: string
  ) {}

  public static fromRequestBody(body: any): SubmitAssignmentDto {
    if (isMissingKeys(body, ['studentId', 'assignmentId'])) {
      throw new InvalidRequestBodyException(['studentId', 'assignmentId']);
    }

    const { studentId, assignmentId } = body;

    return new SubmitAssignmentDto(studentId, assignmentId);
  }
}

export class AssignAssignmentToStudentDto {
  private constructor(
    public readonly studentId: string,
    public readonly assignmentId: string
  ) {}

  public static fromRequestBody(body: any): AssignAssignmentToStudentDto {
    if (isMissingKeys(body, ['studentId', 'assignmentId'])) {
      throw new InvalidRequestBodyException(['studentId', 'assignmentId']);
    }

    const { studentId, assignmentId } = body;

    return new AssignAssignmentToStudentDto(studentId, assignmentId);
  }
}

export class CreateClassAssignmentDto {
  private constructor(
    public readonly classId: string,
    public readonly title: string
  ) {}

  public static fromRequestBody(body: any): CreateClassAssignmentDto {
    if (isMissingKeys(body, ['classId', 'title'])) {
      throw new InvalidRequestBodyException(['classId', 'title']);
    }

    const { classId, title } = body;

    return new CreateClassAssignmentDto(classId, title);
  }
}