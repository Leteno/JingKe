import { ABILITY, Character } from "../data/character";
import { Player } from "../data/player";
import { ClickEvent } from "../misc/event";
import { Align } from "../misc/layout";
import LinearLayout from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";

export default class PlayerDescriptionView extends Panel {

  loyal: TextView;
  attack: TextView;
  inteligence: TextView;
  trust: TextView;

  constructor() {
    super();

    this.layoutParam.xcfg = Align.CENTER;
    this.layoutParam.ycfg = Align.CENTER;

    let attributeLayer = new LinearLayout();
    this.addView(attributeLayer);
    this.loyal = new TextView();
    this.attack = new TextView();
    this.inteligence = new TextView();
    this.trust = new TextView();
    attributeLayer.addView(this.loyal);
    attributeLayer.addView(this.attack);
    attributeLayer.addView(this.inteligence);
    attributeLayer.addView(this.trust);

    this.bgColor = "#FF00FF"
  }

  setCharacter(character: Character) {
    this.bindData(character, (v:PlayerDescriptionView, p: Character) => {
      v.onPlayerUpdate(p);
    });
  }

  onTouchOutside(event: ClickEvent): boolean {
    // Hide when touch outside.
    if (this.visible) {
      this.visible = false;
      return true;
    }
    return false;
  }

  private onPlayerUpdate(character: Character) {
    this.loyal.setText(new Text(
      "侠义: " + character.abilities[ABILITY.LOYAL]
    ));
    this.attack.setText(new Text(
      "勇武: " + character.abilities[ABILITY.ATTACK]
    ));
    this.inteligence.setText(new Text(
      "谋略: " + character.abilities[ABILITY.INTELIGENCE]
    ));
    this.trust.setText(new Text(
      "信誉: " + character.abilities[ABILITY.TRUST]
    ));
  }
}