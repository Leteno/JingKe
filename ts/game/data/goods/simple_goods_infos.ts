import { GoodsInfo } from "../../../data/goods";

export default class SimpleGoodsInfos {
  static LiuWeiWan: GoodsInfo;
  static QinFlag: GoodsInfo;
  static init() {
    let LiuWeiWan = new GoodsInfo();
    LiuWeiWan.name = "六味补气丸";
    LiuWeiWan.cost = 10;
    LiuWeiWan.functional_text = "益气活血，祛痰化瘀";
    LiuWeiWan.image = "res/created/medition.png";
    this.LiuWeiWan = LiuWeiWan;

    let QinFlag = new GoodsInfo();
    QinFlag.name = "秦国军旗";
    QinFlag.cost = 100;
    QinFlag.functional_text = "赳赳大秦，一往无前";
    QinFlag.image = "res/created/flag_of_qin.png";
    this.QinFlag = QinFlag;
  }
}