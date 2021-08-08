import Parcel from "../objects/parcel";
import { BindableAndSerializable, Serializable } from "../objects/serializable";

export enum Event {
  FRE_BEGIN = 0,
  FRE_WHAT_LEARN = 1,
  FRE_WHAT_LOVE = 2,
  FRE_WHAT_CHARECTOR = 3,
}

export enum ABILITY {
  LOYAL = 0, // 侠义
  ATTACK = 1, // 勇武
  INTELIGENCE = 2, // 智慧
  TRUST = 3, // 信誉
}

export class Player extends BindableAndSerializable {
  name: string;
  version: number;
  chooses: Map<number, number>;
  abilities: Array<number>;
  specials: Array<string>;

  static CHOOSE_NOT_FOUND:number = -1;

  constructor() {
    super();
    this.name = "荆棘";
    this.version = 1;
    this.chooses = new Map<number, number>();
    this.abilities = new Array<number>();
    this.specials = new Array<string>();

    // Abilities
    this.abilities[ABILITY.ATTACK] = 0;
    this.abilities[ABILITY.INTELIGENCE] = 0;
    this.abilities[ABILITY.LOYAL] = 0;
    this.abilities[ABILITY.TRUST] = 0;
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
    p.writeString(this.name);
    p.writeInt(this.version);
    // TODO support Map.
    return p;
  }
  fromParcel(p: Parcel) {
    this.name = p.readString();
    this.version = p.readInt();
    // TODO support Map.
  }
}