import { Character } from "./character";

test("alphanumberic", () => {
  let text = "你好，n12world";
  expect(Character.isAlphanumberic(text.charCodeAt(0))).toBe(false);

  expect(Character.isAlphanumberic(
    text.charCodeAt(2)
  )).toBe(false);

  expect(Character.isAlphanumberic(
    text.charCodeAt(3)
  )).toBe(true);
  expect(Character.isAlphanumberic(
    text.charCodeAt(4)
  )).toBe(true);
}) 