import { isMissingKeys } from "./index";
import { InvalidRequestBodyException } from "./exceptions";

export class CreateClassDto {
  private constructor(public name: string) {}

  static fromRequestBody(body: unknown): CreateClassDto {
    if (isMissingKeys(body, ['name'])) {
      throw new InvalidRequestBodyException(['name']);
    }

    const { name } = body as { name: string };
    return new CreateClassDto(name);
  }
}

export class EnrollStudentToClassDto {
  private constructor(public studentId: string, public classId: string) {}

  static fromRequestBody(body: unknown): EnrollStudentToClassDto {
    if (isMissingKeys(body, ['studentId', 'classId'])) {
      throw new InvalidRequestBodyException(['studentId', 'classId']);
    }

    const { studentId, classId } = body as { studentId: string, classId: string };
    return new EnrollStudentToClassDto(studentId, classId);
  }
}