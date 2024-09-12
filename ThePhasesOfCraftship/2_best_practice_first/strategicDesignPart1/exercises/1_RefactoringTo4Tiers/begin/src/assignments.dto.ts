import { isMissingKeys } from "./index";
import { InvalidRequestBodyException } from "./exceptions";

export class GradeAssignmentDto {
  private constructor(
    public readonly id: string,
    public readonly grade: string
  ) {}

  public static fromRequestBody(body: any): GradeAssignmentDto {
    if (isMissingKeys(body, ['id', 'grade'])) {
      throw new InvalidRequestBodyException(['id', 'grade']);
    }

    const { id, grade } = body;

    if (!['A', 'B', 'C', 'D'].includes(grade)) {
      throw new InvalidRequestBodyException(['grade']);
    }

    return new GradeAssignmentDto(id, grade);
  }
}

export class SubmitAssignmentDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestBody(body: any): SubmitAssignmentDto {
    if (isMissingKeys(body, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    const { id } = body;

    return new SubmitAssignmentDto(id);
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