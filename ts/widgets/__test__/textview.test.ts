import { number, string } from "yargs";
import { Specify } from "../../misc/layout";
import TextView, {DrawFunc, Text, TextHelper} from "../textview"
import { defaultCtx } from "./default_value.test";

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
  let textView = new TextView(new Text("大家好，我系渣渣豪，是兄弟，就来 helloworld 砍我把"));
  textView.measure(ctx, 100, 400, Specify.NONE);
  textView.drawToCanvas(ctx);

  expect(mockFillText.mock.calls.length).toBe(3);
  expect(mockFillText.mock.calls[0][0]).toBe("大家好，我系渣渣豪，");
  expect(mockFillText.mock.calls[1][0]).toBe("是兄弟，就来 ");
  expect(mockFillText.mock.calls[2][0]).toBe("helloworld 砍我把");
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
  let textView = new TextView(new Text("大家好，我系渣渣豪，是兄弟，就来某地方砍我把"));
  textView.measure(ctx, 100, 400, Specify.NONE);
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

test("pattern", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    measureText: (str:string) => {
      // Is English.
      // TODO(): the value is poluted by
      // the first test case + TextHelper cache
      return {
        width: 5 * str.length,
      };
    },
    translate(x: number, y: number) {},
  } as CanvasRenderingContext2D;

  let mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  ctx.fillText = mockFillText;

  let mockDrawFunc = jest.fn((
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    text: string) => {
  });
  let textView = new TextView(
    new Text("Hello \fWorld\r, Mr.Zheng")
      .updatePatternDrawFunc("World", {
        draw: mockDrawFunc
      } as DrawFunc
    )
  );
  textView.measure(ctx, 500, 500, Specify.NONE);

  textView.drawToCanvas(ctx);

  expect(mockFillText.mock.calls.length).toBe(2);
  expect(mockFillText.mock.calls[0][0]).toBe("Hello ");
  expect(mockFillText.mock.calls[1][0]).toBe(", Mr.Zheng");

  expect(mockDrawFunc.mock.calls.length).toBe(1);
  expect(mockDrawFunc.mock.calls[0][5]).toBe("World");

  expect(mockFillText.mock.calls[0][1]).toBe(0);
  expect(mockFillText.mock.calls[0][2]).toBe(0);
  expect(mockFillText.mock.calls[1][1]).toBe(55);
  expect(mockFillText.mock.calls[1][2]).toBe(0);

  expect(mockDrawFunc.mock.calls[0][1]).toBe(30);
  expect(mockDrawFunc.mock.calls[0][2]).toBe(0);
  expect(mockDrawFunc.mock.calls[0][3]).toBe(25);
  expect(mockDrawFunc.mock.calls[0][4]).toBe(24);
})

test("English \\n", () => {
  let mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  defaultCtx.fillText = mockFillText;

  let textView = new TextView(
    new Text("Hello World, Mr.Zheng")
  );
  textView.measure(defaultCtx, 500, 500, Specify.NONE);

  textView.drawToCanvas(defaultCtx);
  expect(mockFillText.mock.calls.length)
    .toBe(1);
  expect(mockFillText.mock.calls[0][0])
    .toBe("Hello World, Mr.Zheng");

  mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  defaultCtx.fillText = mockFillText;
  textView.setText(new Text(
    "Hello\n World,\n\n M\nr.Zheng"));
  textView.drawToCanvas(defaultCtx);
  expect(mockFillText.mock.calls.length)
    .toBe(5);
  expect(mockFillText.mock.calls[0][0])
    .toBe("Hello");
  expect(mockFillText.mock.calls[1][0])
    .toBe(" World,");
  expect(mockFillText.mock.calls[2][0])
    .toBe("");
  expect(mockFillText.mock.calls[3][0])
    .toBe(" M");
  expect(mockFillText.mock.calls[4][0])
    .toBe("r.Zheng");
})

test("Chinese \\n", () => {
  let mockFillText = jest.fn((text:string, x: number, y:number, maxWidth?:number|undefined) => {
  });
  defaultCtx.fillText = mockFillText;
  let text = new Text(
    "名字：六味补气丸\n" +
    "数目：999\n"+
    "功效: 听说吃了会很大力");
  let textView = new TextView(text);
  textView.measure(defaultCtx, 70, 500, Specify.NONE);
  textView.drawToCanvas(defaultCtx);
  expect(mockFillText.mock.calls.length)
    .toBe(5);
  expect(mockFillText.mock.calls[0][0])
    .toBe("名字：六味补气");
  expect(mockFillText.mock.calls[1][0])
    .toBe("丸");
  expect(mockFillText.mock.calls[2][0])
    .toBe("数目：999");
  expect(mockFillText.mock.calls[3][0])
    .toBe("功效: 听说吃了");
  expect(mockFillText.mock.calls[4][0])
    .toBe("会很大力");
})