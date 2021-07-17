import { number, string } from "yargs";
import TextView, {TextHelper} from "../textview"

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

test("english", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    measureText: (str:string) => {
      if (str.charCodeAt(0) > 512) {
        // Is Chinese.
        return {
          width: 10 * str.length,
        };
      } else {
        // Is ASII
        return {
          width: 5 * str.length
        }
      }
    },
    translate(x: number, y: number) {},
  } as CanvasRenderingContext2D;
  let mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  ctx.fillText = mockFillText;

  // 22 chars, 220 width
  let textView = new TextView("大家好，我系渣渣豪，是兄弟，就来 helloworld 砍我把");
  textView.measure(ctx, 100, 400);
  textView.drawToCanvas(ctx);

  expect(mockFillText.mock.calls.length).toBe(3);
  expect(mockFillText.mock.calls[0][0]).toBe("大家好，我系渣渣豪，");
  expect(mockFillText.mock.calls[1][0]).toBe("是兄弟，就来 hellowo");
  expect(mockFillText.mock.calls[2][0]).toBe("rld 砍我把");
})

test("animation", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    measureText: (str:string) => {
      // Is Chinese.
      return {
        width: 10 * str.length,
      };
    },
    translate(x: number, y: number) {},
  } as CanvasRenderingContext2D;

  let mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  ctx.fillText = mockFillText;

  // 22 chars, 220 width
  let textView = new TextView("大家好，我系渣渣豪，是兄弟，就来某地方砍我把");
  textView.measure(ctx, 100, 400);
  textView.drawToCanvas(ctx);
  expect(mockFillText.mock.calls.length).toBe(3);
  expect(mockFillText.mock.calls[0][0]).toBe("大家好，我系渣渣豪，");
  expect(mockFillText.mock.calls[1][0]).toBe("是兄弟，就来某地方砍");
  expect(mockFillText.mock.calls[2][0]).toBe("我把");

  let mockFillText2 = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  ctx.fillText = mockFillText2;
  textView.showTextLength = 3;
  textView.drawToCanvas(ctx);
  expect(mockFillText2.mock.calls.length).toBe(1);
  expect(mockFillText2.mock.calls[0][0]).toBe("大家好");

  let mockFillText3 = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  ctx.fillText = mockFillText3;
  textView.showTextLength = 15;
  textView.drawToCanvas(ctx);
  expect(mockFillText3.mock.calls.length).toBe(2);
  expect(mockFillText3.mock.calls[0][0]).toBe("大家好，我系渣渣豪，");
  expect(mockFillText3.mock.calls[1][0]).toBe("是兄弟，就");
})