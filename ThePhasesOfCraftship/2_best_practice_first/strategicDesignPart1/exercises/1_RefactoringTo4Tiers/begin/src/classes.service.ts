import { prisma } from "./database";

export class ClassesService {
  public async createClass(name: string) {
    const cls = await prisma.class.create({
      data: {
        name
      }
    });

    return cls;
  }
}