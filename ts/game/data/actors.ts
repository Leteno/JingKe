import { People } from "../../compose/place_and_people_view";
import { ABILITY, Special } from "../../data/character";

export class Actors {
  businessman: People;
  fanwuji: People;
  juzi: People;

  constructor() {
    let fanwuji = new People();
    fanwuji.character.name = "樊于期";
    fanwuji.character.imageSrc = "res/copyleft/people_fanwuji.png";
    fanwuji.character.abilities[ABILITY.ATTACK] = 10;
    fanwuji.character.specials.push(new Special("勇武", "遇到攻击力比自己高的，攻击力+3"));
    this.fanwuji = fanwuji;

    let juzi = new People();
    juzi.character.name = "莫翟";
    juzi.character.imageSrc = "res/copyleft/people_juzi.png";
    juzi.character.abilities[ABILITY.LOYAL] = 10;
    juzi.character.specials.push(new Special("闲庭", "由于你的步伐过于冷静，正常情况下不会遭遇捕快"));
    juzi.character.specials.push(new Special("义薄云天", "别人遇到任何困难，你都会伸出援手"));
    this.juzi = juzi;

    let businessman = new People();
    businessman.character.name = "商人";
    businessman.character.imageSrc = "res/copyleft/people_businessman.png";
    businessman.character.abilities[ABILITY.INTELIGENCE] = 10;
    businessman.character.specials.push(new Special("口若悬河", "商店购买时，要价便宜 30%"));
    this.businessman = businessman;
  }
}
