import Sprite from "../sprite"

test("isCollideWith", () => {
  let s1 = new Sprite();
  let s2 = new Sprite();

  s1.width = s1.height = s2.width = s2.height = 100;
  s1.x = s1.y = 300;

  // No touch
  s2.x = s2.y = 0;
  expect(s1.isCollideWith(s2)).toBe(false);
  s2.x = 400; s2.y = 0;
  expect(s1.isCollideWith(s2)).toBe(false);

  // Border
  s2.x = 200; s2.y = 300;
  expect(s1.isCollideWith(s2)).toBe(false);
  s2.x = 400; s2.y = 400;
  expect(s1.isCollideWith(s2)).toBe(false);

  // Cover
  s2.x = 250; s2.y = 250;
  expect(s1.isCollideWith(s2)).toBe(true);
  s2.x = 350; s2.y = 350;
  expect(s1.isCollideWith(s2)).toBe(true);
})