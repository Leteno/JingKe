import { People } from "../../compose/place_and_people_view";
import { ABILITY, Special } from "../../data/character";
import { Specials } from "../../data/specials";

export class Actors {
  businessman: People;
  fanwuji: People;
  juzi: People;

  constructor() {
    let fanwuji = new People();
    fanwuji.character.name = "樊于期";
    fanwuji.character.imageSrc = "res/copyleft/people_fanwuji.png";
    fanwuji.character.abilities[ABILITY.ATTACK] = 10;
    fanwuji.character.specials.push(
      Specials.getInstance().brave
    );
    this.fanwuji = fanwuji;

    let juzi = new People();
    juzi.character.name = "莫翟";
    juzi.character.imageSrc = "res/copyleft/people_juzi.png";
    juzi.character.abilities[ABILITY.LOYAL] = 10;
    juzi.character.specials.push(
      Specials.getInstance().xianting,
      Specials.getInstance().yiboyuntian
    );
    this.juzi = juzi;

    let businessman = new People();
    businessman.character.name = "商人";
    businessman.character.imageSrc = "res/copyleft/people_businessman.png";
    businessman.character.abilities[ABILITY.INTELIGENCE] = 10;
    businessman.character.specials.push(
      Specials.getInstance().kouruoxuanhe
    );
    this.businessman = businessman;
  }
}
