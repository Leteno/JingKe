import { BgText } from "../../../widgets/richtext";
import { DrawFunc } from "../../../widgets/textview";

export default class TextEffects {
  static abilityEffect: DrawFunc;
  static nameEffect: DrawFunc;
  static processionEffect: DrawFunc;
  static specialEffect: DrawFunc;

  static init() {
    this.abilityEffect = new BgText("green", "white");
    this.nameEffect = new BgText("green", "black");
    this.processionEffect = new BgText("white", "black");
    this.specialEffect = new BgText("white", "black");
  }
}