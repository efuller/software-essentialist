export class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(", "));

    this.name = "InvalidRequestBodyException";
    Object.setPrototypeOf(this, InvalidRequestBodyException.prototype);
  }
}

export class StudentNotFoundException extends Error {
  constructor() {
    super("Student not found");

    this.name = "StudentNotFoundException";
    Object.setPrototypeOf(this, StudentNotFoundException.prototype);
  }
}

export class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super("Student already enrolled");

    this.name = "StudentAlreadyEnrolledException";
    Object.setPrototypeOf(this, StudentAlreadyEnrolledException.prototype);
  }
}

export class ClassNotFoundException extends Error {
  constructor() {
    super("Class not found");

    this.name = "ClassNotFoundException";
    Object.setPrototypeOf(this, ClassNotFoundException.prototype);
  }
}

export class StudentAssignmentNotFoundException extends Error {
  constructor() {
    super("Student assignment not found");

    this.name = "StudentAssignmentNotFoundException";
    Object.setPrototypeOf(this, StudentAssignmentNotFoundException.prototype);
  }
}

