import { Char } from "../char";

test("alphanumberic", () => {
  let text = "你好，n12world";
  expect(Char.isAlphanumberic(text.charCodeAt(0))).toBe(false);

  expect(Char.isAlphanumberic(
    text.charCodeAt(2)
  )).toBe(false);

  expect(Char.isAlphanumberic(
    text.charCodeAt(3)
  )).toBe(true);
  expect(Char.isAlphanumberic(
    text.charCodeAt(4)
  )).toBe(true);
}) 