import { People } from "../../compose/place_and_people_view";
import { ABILITY } from "../../data/character";
import { Specials } from "../../data/specials";

export class Actors {
  businessman: People;
  fanwuji: People;
  juzi: People;
  jinke: People;
  taizidan: People;

  static instance: Actors = new Actors();

  private constructor() {

    let businessman = new People();
    businessman.character.name = "商人";
    businessman.character.imageSrc = "res/copyleft/people_businessman.png";
    businessman.character.abilities[ABILITY.INTELIGENCE] = 10;
    businessman.character.specials.push(
      Specials.getInstance().kouruoxuanhe
    );
    this.businessman = businessman;

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

    let jinke = new People();
    jinke.character.name = "荆轲";
    jinke.character.imageSrc = "res/copyleft/people_juzi.png";
    this.jinke = jinke;

    let taizidan = new People();
    taizidan.character.name = "太子丹";
    taizidan.character.imageSrc = "res/copyleft/people_taizidan.png";
    taizidan.character.abilities[ABILITY.ATTACK] = 10;
    taizidan.character.abilities[ABILITY.INTELIGENCE] = -10;
    this.taizidan = taizidan;
  }

  static getInstance(): Actors {
    if (this.instance == null) {
      // init here.
      this.instance = new Actors();
    }
    return this.instance;
  }
}
