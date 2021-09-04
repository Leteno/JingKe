import Parcel from "../objects/parcel";
import { BindableAndSerializable, Serializable } from "../objects/serializable";
import { GoodsAffect } from "../special_affect/goods_affect";
import DBManager from "../storage/db_manager";
import { Character } from "./character";
import { Prossession } from "./prossession";
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
  money: number;
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
  }

  static getInstance():Player {
    if (this.instance == null) {
      // init here.
      this.instance = new Player();
    }
    return this.instance;
  }

  readFromDb() {
    let p = DBManager.getInstance().getDb().getData("player");
    if (p.getLength() > 0) {
      this.fromParcel(p);
    }
  }

  saveToDb() {
    DBManager.getInstance().getDb().saveData(
      "player",
      this.toParcel()
    );
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
  
  toParcel(): Parcel {
    let p = new Parcel();
    p.writeInt(this.version);
    p.writeInt(this.money);
    p.writeParcel(this.character.toParcel());
    // TODO support Map.
    return p;
  }
  fromParcel(p: Parcel) {
    this.version = p.readInt();
    this.money = p.readInt();
    this.character = new Character();
    this.character.fromParcel(p.readParcel());
    // TODO support Map.
  }

  applyGoodsEffect(prossession: Prossession) {
    let changed: boolean = false;
    this.character.specials.filter(k => k instanceof GoodsAffect)
      .forEach(affect => {
        changed = (affect as GoodsAffect).affect(prossession) || changed;
      })
    return changed;
  }
}