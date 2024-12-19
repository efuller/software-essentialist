import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';
import { Student } from "@prisma/client";
import { MakeIdOptional } from "../../src/types";

export class StudentBuilder {
  private studentProps: MakeIdOptional<Student>;

  constructor() {
    this.studentProps = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
  }

  withName(name?: string) {
    if (!name) {
      this.studentProps.name = faker.company.buzzPhrase();
      return this;
    }

    this.studentProps.name = name;
    return this;
  }

  withEmail(email?: string) {
    if (!email) {
      this.studentProps.email = faker.internet.email();
      return this;
    }

    this.studentProps.email = email;
    return this;
  }

  async build() {
    const createdStudent = await prisma.student.create({
      data: {
        name: this.studentProps.name,
        email: this.studentProps.email,
      },
    });
    return createdStudent;
  }
}