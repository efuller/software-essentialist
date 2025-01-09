import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';
import { Prisma } from "@prisma/client";

export class StudentBuilder {
  private studentProps: Prisma.StudentCreateInput;

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