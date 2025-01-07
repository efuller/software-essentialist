import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';
import { Prisma } from "@prisma/client";

export class ClassBuilder {
  private classProps: Partial<Prisma.ClassCreateInput>;

  constructor() {
    this.classProps = {
      name: faker.company.buzzPhrase(),
    }
  }

  withName(newName = '') {
    if (!newName) {
      this.classProps.name = faker.company.buzzPhrase();
      return this;
    }

    this.classProps.name = newName;
    return this;
  }

  async build() {
    if (!this.classProps.name) {
      throw new Error('You must provide a name for the class.');
    }
    const createdClass = await prisma.class.create({
      data: {
        name: this.classProps.name,
      },
    });
    return createdClass;
  }
}