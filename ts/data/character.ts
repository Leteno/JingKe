import Parcel from "../objects/parcel";
import parcel from "../objects/parcel";
import { BindableAndSerializable } from "../objects/serializable";
import { SpecialAffect } from "../special_affect/special_affect";
import { BindableData } from "./bindable_data";


export enum ABILITY {
  LOYAL = 0, // 侠义
  ATTACK = 1, // 勇武
  INTELIGENCE = 2, // 智慧
  TRUST = 3, // 信誉
}

export class Character extends BindableAndSerializable {
  name: string;
  imageSrc: string;
  abilities: Array<number>;
  specials: Array<SpecialAffect>;

  constructor() {
    super();
    this.abilities = new Array<number>();
    this.specials = new Array<SpecialAffect>();

    // Abilities
    this.abilities[ABILITY.ATTACK] = 0;
    this.abilities[ABILITY.INTELIGENCE] = 0;
    this.abilities[ABILITY.LOYAL] = 0;
    this.abilities[ABILITY.TRUST] = 0;
  }

  toParcel(): parcel {
    let p = new Parcel();
    p.writeString(this.name);
    p.writeString(this.imageSrc);
    p.writeNumberArray(this.abilities);
    return p;
  }
  fromParcel(p: parcel) {
    this.name = p.readString();
    this.imageSrc = p.readString();
    this.abilities = p.readNumberArray();
  }
}