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