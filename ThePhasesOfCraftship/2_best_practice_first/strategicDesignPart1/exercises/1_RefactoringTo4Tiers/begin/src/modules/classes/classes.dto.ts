import { InvalidRequestBodyException } from "../../shared/exceptions";
import { StringUtils } from "../../shared/stringUtils";
import { ObjectUtils } from "../../shared/objectUtils";

export class GetClassByIdDto {
  private constructor(public id: string) {}

  static fromRequestParams(params: any): GetClassByIdDto {
    if (ObjectUtils.isMissingKeys(params, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!StringUtils.isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    const { id } = params;
    return new GetClassByIdDto(id);
  }
}

export class CreateClassDto {
  private constructor(public name: string) {}

  static fromRequestBody(body: unknown): CreateClassDto {
    if (ObjectUtils.isMissingKeys(body, ['name'])) {
      throw new InvalidRequestBodyException(['name']);
    }

    const { name } = body as { name: string };
    return new CreateClassDto(name);
  }
}

export class EnrollStudentToClassDto {
  private constructor(public studentId: string, public classId: string) {}

  static fromRequestBody(body: unknown): EnrollStudentToClassDto {
    if (ObjectUtils.isMissingKeys(body, ['studentId', 'classId'])) {
      throw new InvalidRequestBodyException(['studentId', 'classId']);
    }

    const { studentId, classId } = body as { studentId: string, classId: string };
    return new EnrollStudentToClassDto(studentId, classId);
  }
}

export class GetClassAssignmentsDto {
  private constructor(public classId: string) {}

  static fromRequestParams(params: any): GetClassAssignmentsDto {
    if (ObjectUtils.isMissingKeys(params, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!StringUtils.isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    const { id } = params;
    return new GetClassAssignmentsDto(id);
  }
}