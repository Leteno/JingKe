import { GoodsAffectFactory, Goods_Type } from "../special_affect/goods_affect";
import { LabelAffectFactory, Label_Type } from "../special_affect/label_affect";
import { SpecialAffect } from "../special_affect/special_affect";

export class Specials {
  simpleAndNaive: SpecialAffect; // 朴素
  brave: SpecialAffect;  // 勇敢
  taizidandeenchong: SpecialAffect;  // 太子丹的恩宠
  xianting: SpecialAffect; // 闲庭
  yiboyuntian: SpecialAffect; // 义薄云天
  kouruoxuanhe: SpecialAffect; // 口若悬河

  static instance = new Specials();
  private constructor() {
    this.simpleAndNaive = LabelAffectFactory.getLabelAffect(Label_Type.SimpleAndNaive)
    this.brave = LabelAffectFactory.getLabelAffect(Label_Type.Brave);
    this.xianting = LabelAffectFactory.getLabelAffect(Label_Type.Xianting);
    this.yiboyuntian = LabelAffectFactory.getLabelAffect(Label_Type.Yiboyuntian);
    this.kouruoxuanhe = GoodsAffectFactory.getGoodsAffect(
      Goods_Type.GACostDiscount,
      "口若悬河", "商店购买时，要价便宜 30%",
      0.7
    );
    this.taizidandeenchong = GoodsAffectFactory.getGoodsAffect(
      Goods_Type.GACostDiscount,
      "太子丹的恩宠", "燕城商店购买免费",
      0
    );
  }

  static getInstance() : Specials {
    return this.instance;
  }
}