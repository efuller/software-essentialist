export class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(", "));
  }
}

export class StudentNotFoundException extends Error {
  constructor() {
    super("Student not found");
  }
}

export class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super("Student already enrolled");
  }
}

export class ClassNotFoundException extends Error {
  constructor() {
    super("Class not found");
  }
}

export class AssignmentNotFoundException extends Error {
  constructor() {
    super("Assignment not found");
  }
}