import { Goods } from "../../data/goods"
import { getEnumCases } from "../../misc/enum";
import {GoodsAffect, GoodsAffectFactory, Goods_Type} from "../goods_affect"

test("one rule", () => {
  let x = new Goods();
  x.count = 12;
  x.cost = 10;

  let affect1 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACostDiscount, "", "", 0.1
  ) as GoodsAffect;
  affect1.affect(x);
  expect(x.cost).toBe(1);
})

test("mix rules", () => {
  let x = new Goods();
  x.count = 12;
  x.cost = 10;
  let affect1 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACostDiscount, "", "", 0.1
  ) as GoodsAffect;
  let affect2 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACountChange, "", "", 1
  ) as GoodsAffect;
  affect1.affect(x);
  affect2.affect(x);
  expect(x.count).toBe(13);
  expect(x.cost).toBe(1);
})

test("crazy rules", () => {
  let x = new Goods();
  x.count = 12;
  x.cost = 10;
  let affect1 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACountChange, "", "", -13
  ) as GoodsAffect;
  affect1.affect(x);
  expect(x.count).toBe(0);
})

test("all type should be valid", () => {
  let types = getEnumCases(Goods_Type) as Goods_Type[];
  for (let i = 0; i < types.length; i++) {
    let element = types[i];
    let affect1 = GoodsAffectFactory.getGoodsAffect(
      element, "", "", 1
    );
    expect(affect1).not.toBe(null);
  }
})