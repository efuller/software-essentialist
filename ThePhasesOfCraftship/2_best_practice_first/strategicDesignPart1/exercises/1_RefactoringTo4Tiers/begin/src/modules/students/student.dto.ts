import { InvalidRequestBodyException } from "../../shared/exceptions";
import { ObjectUtils } from "../../shared/objectUtils";
import { StringUtils } from "../../shared/stringUtils";

export class CreateStudentDto {
  private constructor(
    public readonly name: string
  ) {}

  public static fromRequestBody(body: any): CreateStudentDto {
    if (ObjectUtils.isMissingKeys(body, ['name'])) {
      throw new InvalidRequestBodyException(['name']);
    }
    return new CreateStudentDto(body.name);
  }
}

export class GetStudentByIdDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: any): GetStudentByIdDto {
    if (ObjectUtils.isMissingKeys(params, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!StringUtils.isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentByIdDto(params.id);
  }
}

export class GetStudentSubmittedAssignmentsDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: any): GetStudentSubmittedAssignmentsDto {
    if (ObjectUtils.isMissingKeys(params, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!StringUtils.isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentSubmittedAssignmentsDto(params.id);
  }
}

export class GetStudentGradesDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: any): GetStudentGradesDto {
    if (ObjectUtils.isMissingKeys(params, ['id'])) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!StringUtils.isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentGradesDto(params.id);
  }
}