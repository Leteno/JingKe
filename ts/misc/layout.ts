
export enum Align {
  START, END, CENTER
}

export class LayoutParams {
  xcfg: Align;
  ycfg: Align;
  constructor(xcfg: Align, ycfg: Align) {
    this.xcfg = xcfg;
    this.ycfg = ycfg;
  }

  static normal(): LayoutParams {
    return new LayoutParams(Align.START, Align.START)
  }
}