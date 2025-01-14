export type MakeIdOptional<T> = Omit<T, 'id'> & { id?: T extends { id: infer U } ? T['id'] : string };

type Test = {
  id: string;
  name: string;
  description: string;
  age: number;
}

/**
 * Make the properties of an object optional.
 *
 * We have two versions, one that is using a TS Utility Type and another that is using a mapped type.
 * @see https://chatgpt.com/c/6766c0ab-9fd0-800c-9d63-f26714e079f8
 */
type MakeOptional<T, K extends keyof T> = T extends Record<string, any>
  ? { [P in K]+?: T[P] } & { [P in Exclude<keyof T, K>]: T[P] }
  : never;

type MakeOptional1<TData, Key extends keyof TData> = TData extends Record<string, any>
  ? { [Prop in Key]+?: TData[Prop] } & { [Prop in keyof TData as Prop extends Key ? never : Prop]: TData[Prop] }
  : never;

type IdAndName1 = MakeOptional<Test, 'id' | 'name'>;
type IdAndName2 = MakeOptional1<Test, 'id' | 'name'>;

const person: IdAndName2 = {
  id: '123',
  name: 'John',
  description: 'A person',
  age: 30
}

type Test2 = keyof Test;

/* ------------------------------------------------ */
/*                    Omit                          */
/* ------------------------------------------------ */
type MyOmit<T, U> = {
  [Prop in keyof T as Prop extends U ? never : Prop]: T[Prop]
}

type MyCustomOmit = MyOmit<Test, 'id' | 'name'>

/* ------------------------------------------------ */
/*                    Pick                          */
/* ------------------------------------------------ */
type MyPick<T, U> = {
  [Prop in keyof T as Prop extends U ? Prop : never]: T[Prop]
}

type WithIdAndName = MyPick<Test, 'id' | 'name'>

/**
 * Will remove properties that have a type of never.
 *
 * @see https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-zod/src/utils.ts#L34
 */
export type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type HiThere = {
  id: number;
  name: string;
  job: never;
}

type HiThereNew = RemoveNever<HiThere>;

// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type MappedTypeWithNewProperties<Type> = {
  [Prop in keyof Type]: Type[Prop]
}

type Test3 = MappedTypeWithNewProperties<HiThere>;

// ----------------------------------------------------------------------
type MyHTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

type IsHTTPMethod<T> = T extends MyHTTPMethods ? T : never;