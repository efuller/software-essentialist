import { AssignmentSubmission, Class, ClassEnrollment, Student, StudentAssignment } from "@prisma/client";

export interface EnrolledStudent {
  classEnrollment: ClassEnrollment,
  student: Student,
  newClass: Class
};

export interface StudentSubmitAssignment {
  submittedAssignment: AssignmentSubmission;
  student: Student;
  assignedAssignment: StudentAssignment;
  newClass: Class;
  classEnrollment: ClassEnrollment;
}

