import SimpleGoodsInfos from "../../game/data/goods/simple_goods_infos"
import Parcel from "../../objects/parcel";
import { Goods } from "../goods";

beforeAll(() => {
  SimpleGoodsInfos.init();
})

test("parcel", () => {
  let g1 = new Goods(SimpleGoodsInfos.LiuWeiWan, 10);
  expect(g1.cost).toBe(SimpleGoodsInfos.LiuWeiWan.cost);

  let p1 = new Parcel();
  g1.toParcel(p1);
  let g2 = new Goods();
  g2.fromParcel(p1);
  expect(g2.info).toEqual(SimpleGoodsInfos.LiuWeiWan);
  expect(g2.cost).toBe(SimpleGoodsInfos.LiuWeiWan.cost);

  g1.cost -= 10;
  let p2 = new Parcel();
  g1.toParcel(p2);
  let g3 = new Goods();
  g3.fromParcel(p2);
  expect(g3.info).toEqual(SimpleGoodsInfos.LiuWeiWan);
  // cost is unchanged.
  expect(g3.cost).toBe(SimpleGoodsInfos.LiuWeiWan.cost);
})