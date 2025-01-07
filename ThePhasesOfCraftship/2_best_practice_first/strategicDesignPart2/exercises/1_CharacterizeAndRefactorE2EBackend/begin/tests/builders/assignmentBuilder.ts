import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';
import { Class, Prisma } from "@prisma/client";

export class AssignmentBuilder {
  private assignmentProps: Partial<Prisma.AssignmentCreateInput>;

  constructor() {
    this.assignmentProps = {
      title: faker.company.buzzPhrase(),
    };
  }

  fromClass(newClass: Class) {
    this.assignmentProps = {
      ...this.assignmentProps,
      class: {
        connect: {
          id: newClass.id
        }
      }
    }
    return this;
  }

  withTitle(title?: string) {
    if (!title) {
      this.assignmentProps.title = faker.company.buzzPhrase();
      return this;
    }

    this.assignmentProps.title = title;
    return this;
  }

  async build() {
    if (!this.assignmentProps.title) {
      throw new Error('You must have a title to assign the assignment to.');
    }

    if (!this.assignmentProps.class) {
      throw new Error('You must have a class to assign the assignment to.');
    }

    const createdAssignment = await prisma.assignment.create({
      data: {
        title: this.assignmentProps.title,
        class: this.assignmentProps.class
      },
    });
    return createdAssignment;
  }
}