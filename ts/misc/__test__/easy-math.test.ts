import EasyMath from "../easy-math"

test("testBetween", () => {
  expect(EasyMath.between(1, 3, 1)).toBe(true);
  expect(EasyMath.between(1, 3, 2)).toBe(true);
  expect(EasyMath.between(1, 3, 3)).toBe(true);
  expect(EasyMath.between(1, 3, 0)).toBe(false);
  expect(EasyMath.between(1, 3, 4)).toBe(false);
})