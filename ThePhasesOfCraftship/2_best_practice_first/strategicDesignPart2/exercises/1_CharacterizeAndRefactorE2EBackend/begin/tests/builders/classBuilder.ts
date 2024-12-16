import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';

export class ClassBuilder {
  private className: string;

  constructor() {
    this.className = '';
  }

  withName(name?: string) {
    if (!name) {
      this.className = faker.company.buzzPhrase();
      return this;
    }

    this.className = name;
    return this;
  }

  async build() {
    const createdClass = await prisma.class.create({
      data: {
        name: this.className,
      },
    });
    return createdClass;
  }
}