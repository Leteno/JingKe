
import {getEnumCases} from "../enum"

test("", () => {
  enum T {
    t1,
    t2,
    t3
  }
  let types = getEnumCases(T) as T[];
  expect(types.length).toBe(3);
  expect(types.findIndex((k) => T.t1 == k)).toBeGreaterThanOrEqual(0);
  expect(types.findIndex((k) => T.t2 == k)).toBeGreaterThanOrEqual(0);
  expect(types.findIndex((k) => T.t3 == k)).toBeGreaterThanOrEqual(0);
})