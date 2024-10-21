export class ObjectUtils {
  public static isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    }
    return false;
  }

  public static parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
  }
}