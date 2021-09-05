import { string } from "yargs";
import { ABILITY, Character } from "../data/character";
import { Player } from "../data/player";
import { ClickEvent } from "../misc/event";
import { Align } from "../misc/layout";
import ImageView from "../widgets/imageview";
import LinearLayout from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import { BgText } from "../widgets/richtext";
import TextView, { Text } from "../widgets/textview";

export default class PlayerDescriptionView extends Panel {

  name: TextView;
  image: ImageView;
  loyal: TextView;
  attack: TextView;
  inteligence: TextView;
  trust: TextView;
  special: TextView;

  constructor() {
    super();
    this.padding.top = 20;
    this.padding.bottom = 20;
    this.padding.left = 20;
    this.padding.right = 20;

    let mainFrame = new LinearLayout();
    this.addView(mainFrame);

    this.name = new TextView();
    this.name.margin.bottom = 10;
    this.name.textSize = 28;
    this.name.textColor = "black"
    mainFrame.addView(this.name);

    let attributeLayer = new LinearLayout();
    let label = new TextView(new Text("属性"));
    label.textColor = "black";
    attributeLayer.addView(label);
    this.loyal = new TextView();
    this.attack = new TextView();
    this.inteligence = new TextView();
    this.trust = new TextView();
    this.loyal.textSize = 12;
    this.attack.textSize = 12;
    this.inteligence.textSize = 12;
    this.trust.textSize = 12;
    this.loyal.textColor = "black";
    this.attack.textColor = "black";
    this.inteligence.textColor = "black";
    this.trust.textColor = "black";
    attributeLayer.addView(this.loyal);
    attributeLayer.addView(this.attack);
    attributeLayer.addView(this.inteligence);
    attributeLayer.addView(this.trust);
    mainFrame.addView(attributeLayer);
    attributeLayer.margin.bottom = 20;

    let specialLabel = new TextView(new Text("特技"));
    specialLabel.textColor = "black";
    mainFrame.addView(specialLabel);
    specialLabel.margin.bottom = 10;
    this.special = new TextView();
    this.special.textSize = 12;
    this.special.textColor = "black";
    mainFrame.addView(this.special);

    this.image = new ImageView("");
    this.image.forceWidth = 120;
    this.image.forceHeight = 120;
    this.image.layoutParam.xcfg = Align.END;
    this.addView(this.image);

    this.bgColor = "#FFF99D"
  }

  setCharacter(character: Character) {
    this.onPlayerUpdate(character);
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
    this.name.setText(new Text(character.name));
    this.image.img.src = character.imageSrc;
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
    let descriptionText = "";
    character.specials.forEach(special => {
      descriptionText += `\f${special.name}\r ${special.description}\n`;
    })
    let description = new Text(descriptionText);
    description.setDefaultEffect(new BgText("white", "black"));
    this.special.setText(description);
  }
}