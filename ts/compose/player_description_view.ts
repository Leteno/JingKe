import { ABILITY, Player } from "../data/player";
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

  setPlayer(player: Player) {
    this.bindData(player, (v:PlayerDescriptionView, p: Player) => {
      v.onPlayerUpdate(p);
    });
  }

  private onPlayerUpdate(player: Player) {
    this.loyal.setText(new Text(
      "侠义: " + player.abilities[ABILITY.LOYAL]
    ));
    this.attack.setText(new Text(
      "勇武: " + player.abilities[ABILITY.ATTACK]
    ));
    this.inteligence.setText(new Text(
      "谋略: " + player.abilities[ABILITY.INTELIGENCE]
    ));
    this.trust.setText(new Text(
      "信誉: " + player.abilities[ABILITY.TRUST]
    ));
  }
}