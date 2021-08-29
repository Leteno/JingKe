import { Prossession } from "../../data/prossession"
import { Clone } from "../../misc/clone";
import {GoodsAffectFactory, TYPE} from "../goods_affect"

test("one rule", () => {
  let x = new Prossession();
  x.count = 12;
  x.cost = 10;

  let affect1 = GoodsAffectFactory.getGoodsAffect(
    TYPE.GACostDiscount, "", "", 0.1
  );
  affect1.affect(x);
  expect(x.cost).toBe(1);
})

test("mix rules", () => {
  let x = new Prossession();
  x.count = 12;
  x.cost = 10;
  let affect1 = GoodsAffectFactory.getGoodsAffect(
    TYPE.GACostDiscount, "", "", 0.1
  );
  let affect2 = GoodsAffectFactory.getGoodsAffect(
    TYPE.GACountChange, "", "", 1
  );
  affect1.affect(x);
  affect2.affect(x);
  expect(x.count).toBe(13);
  expect(x.cost).toBe(1);
})

test("crazy rules", () => {
  let x = new Prossession();
  x.count = 12;
  x.cost = 10;
  let affect1 = GoodsAffectFactory.getGoodsAffect(
    TYPE.GACountChange, "", "", -13
  );
  affect1.affect(x);
  expect(x.count).toBe(0);
})