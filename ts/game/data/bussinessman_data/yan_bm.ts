import BussinessMan from "../../../data/bussinessman";
import { Goods } from "../../../data/goods";
import SimpleGoodsInfos from "../goods/simple_goods_infos";

export class YanBm extends BussinessMan {
  static instance;

  static init() {
    this.instance = new YanBm();
  }

  initGoodsList(list: Goods[]) {
    list.push(new Goods(SimpleGoodsInfos.LiuWeiWan, 100));
    list.push(new Goods(SimpleGoodsInfos.QinFlag, 1));
  }
}