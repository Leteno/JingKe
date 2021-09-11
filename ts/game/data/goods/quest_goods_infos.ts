import { GoodsInfo } from "../../../data/goods";

export default class QuestGoodsInfos {
  static YanWine: GoodsInfo;
  static init() {
    let YanWine = new GoodsInfo();
    YanWine.name = "燕浊酒";
    YanWine.cost = 10;
    YanWine.functional_text = "浊酒入肠，醉而忘乡";
    YanWine.image = "res/created/medition.png";
    this.YanWine = YanWine;
  }
}