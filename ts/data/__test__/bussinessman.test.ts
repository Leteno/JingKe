
import SimpleGoodsInfos from "../../game/data/goods/simple_goods_infos";
import Parcel from "../../objects/parcel";
import BussinessMan from "../bussinessman"
import { Goods } from "../goods"

class BMTest extends BussinessMan {
  initGoodsList(list: Goods[]) {
    list.push(new Goods(SimpleGoodsInfos.LiuWeiWan, 100));
    list.push(new Goods(SimpleGoodsInfos.QinFlag, 1));
  }
}
beforeAll(() => {
  SimpleGoodsInfos.init();
})

test("parcel", ()=> {
  let bm = new BMTest();
  bm.goodsList.forEach(goods => {
    goods.count--;
  })
  let p = new Parcel();
  bm.toParcel(p);

  let t = new BMTest();
  t.fromParcel(p);
  expect(t.goodsList.length).toBe(2);
  expect(t.goodsList[0].count).toBe(99);
  expect(t.goodsList[1].count).toBe(0);
  expect(t.goodsList[0].info).toEqual(SimpleGoodsInfos.LiuWeiWan);
  expect(t.goodsList[1].info).toEqual(SimpleGoodsInfos.QinFlag);
})