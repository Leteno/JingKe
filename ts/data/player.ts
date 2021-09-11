import Parcel from "../objects/parcel";
import { BindableAndSerializable, Serializable } from "../objects/serializable";
import { GoodsAffect } from "../special_affect/goods_affect";
import { Character } from "./character";
import { Goods as Goods } from "./goods";
import Quest from "./quest";
import { Specials } from "./specials";

export enum Event {
  FRE_BEGIN = 0,
  FRE_WHAT_LEARN = 1,
  FRE_WHAT_LOVE = 2,
  FRE_WHAT_CHARECTOR = 3,
}

export class Player extends BindableAndSerializable {
  version: number;
  chooses: Map<number, number>;
  character: Character;
  quests: Array<Quest>;
  money: number;
  possessions: Goods[];
  static instance: Player = new Player();

  static CHOOSE_NOT_FOUND:number = -1;

  private constructor() {
    super();
    this.character = new Character();
    this.character.name = "荆棘";
    this.character.imageSrc = "res/copyleft/people_gainie.png";
    this.version = 1;
    this.chooses = new Map<number, number>();
    this.money = 20;
    this.character.specials.push(Specials.getInstance().kouruoxuanhe);
    this.quests = [];
    this.possessions = [];
  }

  static getInstance():Player {
    if (this.instance == null) {
      // init here.
      this.instance = new Player();
    }
    return this.instance;
  }

  saveChoose(event: Event, choose: number) {
    this.chooses.set(event, choose);
  }

  getChoose(event: Event): number {
    if (!this.chooses.has(event)) {
      return Player.CHOOSE_NOT_FOUND;
    }
    return this.chooses.get(event);
  }
  
  toParcel(p: Parcel) {
    p.writeInt(this.version);
    p.writeInt(this.money);
    this.character.toParcel(p);

    p.writeInt(this.quests.length);
    for (let i = 0; i < this.quests.length; i++) {
      this.quests[i].toParcel(p);
    }

    p.writeInt(this.possessions.length);
    for (let i = 0; i < this.possessions.length; i++) {
      this.possessions[i].toParcel(p);
    }

    // TODO support Map.
  }

  fromParcel(p: Parcel) {
    this.version = p.readInt();
    this.money = p.readInt();
    this.character = new Character();
    this.character.fromParcel(p);
    this.quests.splice(0);

    let questSize = p.readInt();
    for (let i = 0; i < questSize; i++) {
      let quest = new Quest();
      quest.fromParcel(p);
      this.quests.push(quest);
    }

    let prossessionSize = p.readInt();
    for (let i = 0; i < prossessionSize; i++) {
      let possession = new Goods();
      possession.fromParcel(p);
      this.possessions.push(possession);
    }

    // TODO support Map.
  }

  applyGoodsEffect(possession: Goods) {
    let changed: boolean = false;
    this.character.specials.filter(k => k instanceof GoodsAffect)
      .forEach(affect => {
        changed = (affect as GoodsAffect).affect(possession) || changed;
      })
    return changed;
  }
}