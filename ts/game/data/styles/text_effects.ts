import { BgText } from "../../../widgets/richtext";
import { DrawFunc } from "../../../widgets/textview";

export default class TextEffects {
  static abilityEffect: DrawFunc;
  static specialEffect: DrawFunc;
  static nameEffect: DrawFunc;

  static init() {
    this.abilityEffect = new BgText("green", "white");
    this.specialEffect = new BgText("white", "black");
    this.nameEffect = new BgText("green", "black");
  }
}