import { isMissingKeys, isUUID } from "./index";
import { InvalidRequestBodyException } from "./exceptions";

export class GetClassByIdDto {
  private constructor(public id: string) {}

  static fromRequestParams(params: unknown): GetClassByIdDto {
    if (!this.isValidParams(params)) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    const { id } = params;
    return new GetClassByIdDto(id);
  }

  private static isValidParams(params: unknown): params is RequestParams & { id: string } {
    return (
      params !== null &&
      typeof params === 'object' &&
      'id' in params &&
      typeof params.id === 'string'
    );
  }
}

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

interface RequestParams {
  id?: unknown;
}

export class GetClassAssignmentsDto {
  private constructor(public classId: string) {}

  static fromRequestParams(params: unknown): GetClassAssignmentsDto {
    if (!this.isValidParams(params)) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    const { id } = params;
    return new GetClassAssignmentsDto(id);
  }

  private static isValidParams(params: unknown): params is RequestParams & { id: string } {
    return (
      params !== null &&
      typeof params === 'object' &&
      'id' in params &&
      typeof params.id === 'string'
    );
  }
}