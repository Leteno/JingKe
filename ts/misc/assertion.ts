
export default class Assertion {
  static expectTrue(val: boolean) {
    if (!val) {
      throw new Error("expectTrue, but get false");
    }
  }
  static expectFalse(val: boolean) {
    if (val) {
      throw new Error("expectFalse, but get true");
    }
  }
}