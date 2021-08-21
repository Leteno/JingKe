
export enum Align {
  START, END, CENTER
}

export enum LayoutType {
  MATCH_PARENT,
  WRAP_CONTNET,
}

export enum Specify {
  NONE = 0,
  X = 1,
  Y = 2,
}

export class LayoutParams {
  xcfg: Align;
  ycfg: Align;
  xLayout: LayoutType;
  yLayout: LayoutType;
  weight: number;
  constructor(xcfg: Align, ycfg: Align,
    xType: LayoutType=LayoutType.WRAP_CONTNET,
    yType: LayoutType=LayoutType.WRAP_CONTNET) {
    this.xcfg = xcfg;
    this.ycfg = ycfg;
    this.xLayout = xType;
    this.yLayout = yType;
    this.weight = 0;
  }

  static normal(): LayoutParams {
    return new LayoutParams(
      Align.START,
      Align.START,
    );
  }
}