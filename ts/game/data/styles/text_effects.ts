import { BgText } from "../../../widgets/richtext";
import { DrawFunc } from "../../../widgets/textview";

export default class TextEffects {
  static abilityEffect: DrawFunc;
  static goodsEffect: DrawFunc;
  static labelEffect: DrawFunc;
  static nameEffect: DrawFunc;
  static placeEffect: DrawFunc;
  static specialEffect: DrawFunc;

  static init() {
    this.abilityEffect = new BgText("green", "white");
    this.goodsEffect = new BgText("white", "black");
    this.labelEffect = new BgText("white", "black");
    this.nameEffect = new BgText("green", "black");
    this.placeEffect = new BgText("white", "black");
    this.specialEffect = new BgText("white", "black");
  }
}