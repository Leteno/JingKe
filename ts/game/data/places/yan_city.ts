import { GoodsPanelModel } from "../../../compose/goods_panel";
import { Place } from "../../../compose/place_and_people_view";
import { Goods, GoodsInfo } from "../../../data/goods";
import SimpleScene from "../../../scene/simple_scene";
import { Actors } from "../actors";

export default class YanCity {
  static city: Place;
  static market: Place;
  static palace: Place;

  static init(that: SimpleScene) {
    let mainPlace = new Place();
    let palace = new Place();
    let market = new Place();
    palace.imageSrc = "res/copyleft/place_yan_palace.png";
    market.imageSrc = "res/copyleft/place_market.png";
    palace.onpressListener = () => {
      console.log("This is the palace of Prince Dan");
    }
    market.onpressListener = () => {
      console.log("This is the place for poors");
    }
    palace.peoples.push(Actors.getInstance().fanwuji);
    mainPlace.peoples.push(Actors.getInstance().juzi);

    market.peoples.push(Actors.getInstance().businessman);
    mainPlace.places.push(palace, market);
    Actors.getInstance().businessman.onclickListener = () => {
      let model = new GoodsPanelModel();
      let info1 = new GoodsInfo();
      info1.name = "六味补气丸";
      info1.cost = 10;
      info1.functional_text = "益气活血，祛痰化瘀";
      info1.image = "res/created/medition.png";
      let p1 = new Goods(info1);
      p1.count = 100;
      let info2 = new GoodsInfo();
      info2.name = "秦国军旗";
      info2.cost = 100;
      info2.functional_text = "赳赳大秦，一往无前";
      info2.image = "res/created/flag_of_qin.png";
      let p2 = new Goods(info2);
      p2.count = 1;
      model.goodsList.push(p1, p2);
      that.showGoodsPanel(model);
    }
    this.city = mainPlace;
    this.market = market;
    this.palace = palace;
  }
}