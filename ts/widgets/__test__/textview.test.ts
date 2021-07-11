import { number, string } from "yargs";
import {TextHelper} from "../textview"

test("testCalculate", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    measureText: (string) => {
      return {
        width: 50, // we assume text is "你好，世界"
      };
    },
  } as CanvasRenderingContext2D;

  let instance = TextHelper.getInstance();
  expect(instance.storeMap.has(40)).toBe(false);

  expect(instance.calculateCharInLine(ctx, 40, 300))
    .toBe(30);
  expect(instance.storeMap.has(40)).toBe(true);
  expect(instance.storeMap.get(40)?.has(300)).toBe(true);
  expect(instance.storeMap.get(40)?.get(300)).toBe(30);

  let mockMeasureText = jest.fn((string) => {
    return {
      width: 50,
    } as TextMetrics
  });
  ctx.measureText = mockMeasureText;
  instance.calculateCharInLine(ctx, 40, 300);
  // we should not call measure again, as we have cached.
  expect(mockMeasureText.mock.calls.length).toBe(0);
});