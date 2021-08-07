export let defaultCtx = {
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

test("", ()=> {})