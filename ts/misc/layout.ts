
export enum Align {
  START, END, CENTER
}

export enum LayoutType {
  MATCH_PARENT,
  WRAP_CONTNET,
}

export class LayoutParams {
  xcfg: Align;
  ycfg: Align;
  xLayout: LayoutType;
  yLayout: LayoutType;
  constructor(xcfg: Align, ycfg: Align,
    xType: LayoutType=LayoutType.WRAP_CONTNET,
    yType: LayoutType=LayoutType.WRAP_CONTNET) {
    this.xcfg = xcfg;
    this.ycfg = ycfg;
    this.xLayout = xType;
    this.yLayout = yType;
  }

  static normal(): LayoutParams {
    return new LayoutParams(
      Align.START,
      Align.START,
    );
  }
}