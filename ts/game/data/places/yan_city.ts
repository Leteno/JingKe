import { GoodsPanelModel } from "../../../compose/goods_panel";
import { Place } from "../../../compose/place_and_people_view";
import { Goods, GoodsInfo } from "../../../data/goods";
import SimpleScene from "../../../scene/simple_scene";
import { Actors } from "../actors";
import { YanBm } from "../bussinessman_data/yan_bm";
import SimpleGoodsInfos from "../goods/simple_goods_infos";

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
      model.goodsList = YanBm.instance.goodsList;
      that.showGoodsPanel(model);
    }
    this.city = mainPlace;
    this.market = market;
    this.palace = palace;
  }
}