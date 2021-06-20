
export default class EasyMath {
  static between(from: number, to: number, test: number) : boolean {
    return from <= test && to >= test;
  }
}