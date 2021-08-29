import {waitForMs} from "../concurency"

test("wait_for_two_second", async() => {
  let n = 1;
  setTimeout(() => {
    n = 3;
  }, 500);
  expect(n).toBe(1);
  await waitForMs(1000);
  expect(n).toBe(3);
})