import { Special } from "./character";

export class Specials {
  brave: Special;  // 勇敢
  xianting: Special; // 闲庭
  yiboyuntian: Special; // 义薄云天
  kouruoxuanhe: Special; // 口若悬河

  private static instance = new Specials();
  private constructor() {
    this.brave = new Special("勇敢", "遇到攻击力比自己高的，攻击力+3");
    this.xianting = new Special("闲庭", "由于你的步伐过于冷静，正常情况下不会遭遇捕快");
    this.yiboyuntian = new Special("义薄云天", "别人遇到任何困难，你都会伸出援手");
    this.kouruoxuanhe = new Special("口若悬河", "商店购买时，要价便宜 30%");
  }

  static getInstance() : Specials {
    return this.instance;
  }
}