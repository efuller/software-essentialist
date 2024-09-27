import { isMissingKeys, isUUID } from "../../index";
import { InvalidRequestBodyException } from "../../exceptions";

export class CreateStudentDto {
  private constructor(
    public readonly name: string
  ) {}

  public static fromRequestBody(body: any): CreateStudentDto {
    if (isMissingKeys(body, ['name'])) {
      throw new InvalidRequestBodyException(['name']);
    }
    return new CreateStudentDto(body.name);
  }
}

interface RequestParams {
  id?: unknown;
}

export class GetStudentByIdDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: unknown): GetStudentByIdDto {
    if (!this.isValidParams(params)) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentByIdDto(params.id);
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

export class GetStudentSubmittedAssignmentsDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: any): GetStudentSubmittedAssignmentsDto {
    if (!this.isValidParams(params)) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentSubmittedAssignmentsDto(params.id);
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

export class GetStudentGradesDto {
  private constructor(
    public readonly id: string
  ) {}

  public static fromRequestParams(params: any): GetStudentGradesDto {
    if (!this.isValidParams(params)) {
      throw new InvalidRequestBodyException(['id']);
    }

    if (!isUUID(params.id)) {
      throw new InvalidRequestBodyException(['id']);
    }

    return new GetStudentGradesDto(params.id);
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