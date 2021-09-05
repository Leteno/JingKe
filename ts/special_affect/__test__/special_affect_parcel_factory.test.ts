import { Prossession } from "../../data/prossession";
import Parcel from "../../objects/parcel";
import { GoodsAffect, GoodsAffectFactory, Goods_Type } from "../goods_affect"
import { LabelAffectFactory, Label_Type } from "../label_affect";
import SpecialAffectParcelFactory from "../special_affect_parcel_factory"

test("GoodsAffect write and read", () => {
  let affect1 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACostDiscount, "affect1", "foo", 0.1
  ) as GoodsAffect;
  let affect2 = GoodsAffectFactory.getGoodsAffect(
    Goods_Type.GACountChange, "affect2", "bar", 1
  ) as GoodsAffect;

  let p = new Parcel();
  SpecialAffectParcelFactory.toParcel(affect1, p);
  SpecialAffectParcelFactory.toParcel(affect2, p);

  let out1 = SpecialAffectParcelFactory.fromParcel(p);
  let out2 = SpecialAffectParcelFactory.fromParcel(p);
  expect(out1.name).toBe("affect1");
  expect(out1.description).toBe("foo");
  expect(out2.name).toBe("affect2");
  expect(out2.description).toBe("bar");

  let x = new Prossession();
  x.count = 12;
  x.cost = 10;
  (out1 as GoodsAffect).affect(x);
  (out2 as GoodsAffect).affect(x);
  expect(x.count).toBe(13);
  expect(x.cost).toBe(1);
})

test("LabelAffect save and read", () => {
  let l1 = LabelAffectFactory.getLabelAffect(Label_Type.Yiboyuntian);
  let l2 = LabelAffectFactory.getLabelAffect(Label_Type.Brave);

  let p = new Parcel();
  LabelAffectFactory.toParcel(l1, p);
  LabelAffectFactory.toParcel(l2, p);

  let out1 = LabelAffectFactory.fromParcel(p);
  let out2 = LabelAffectFactory.fromParcel(p);
  expect(out1.type).toBe(Label_Type.Yiboyuntian);
  expect(out1.name).toBe("义薄云天");
  expect(out2.type).toBe(Label_Type.Brave);
  expect(out2.name).toBe("勇敢");
})