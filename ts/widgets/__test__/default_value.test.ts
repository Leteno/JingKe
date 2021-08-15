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
  drawImage(
    img:HTMLImageElement,
    dx: number, dy: number,
    dw: number, dh: number) {},
  fillRect(x: number, y:number, w: number, h: number) {},
  fillText(text:string, x: number, y:number) {},
} as CanvasRenderingContext2D;

test("", ()=> {})