export type MakeIdOptional<T> = Omit<T, 'id'> & { id?: T extends { id: infer U } ? T['id'] : string };
