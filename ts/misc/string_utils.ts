

export class StringUtils {
  static isEmpty(str: string):boolean {
    return !(str && str.length > 0);
  }
}