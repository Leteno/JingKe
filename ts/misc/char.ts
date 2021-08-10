
export class Char {
  static isAlphanumberic(ch: number) {
    return (ch >= 48 && ch <= 57) || // 0-9
    (ch >= 65 && ch <= 90) || // A-Z
    (ch >= 97 && ch <= 122);
  }
}