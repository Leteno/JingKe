import { GoodsPanelModel } from "../../../compose/goods_panel";
import { Place } from "../../../compose/place_and_people_view";
import { Prossession } from "../../../data/prossession";
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
      let p1 = new Prossession();
      p1.name = "六味补气丸";
      p1.cost = 10;
      p1.count = 10;
      p1.functional_text = "益气活血，祛痰化瘀";
      p1.image = "res/created/medition.png";
      let p2 = new Prossession();
      p2.name = "秦国军旗";
      p2.cost = 100;
      p2.count = 1;
      p2.functional_text = "赳赳大秦，一往无前";
      p2.image = "res/created/flag_of_qin.png";
      model.goodsList.push(p1, p2);
      that.showGoodsPanel(model);
    }
    this.city = mainPlace;
    this.market = market;
    this.palace = palace;
  }
}