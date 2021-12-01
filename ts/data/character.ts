import Parcel from "../objects/parcel";
import parcel from "../objects/parcel";
import { BindableAndSerializable } from "../objects/serializable";
import { SpecialAffect } from "../special_affect/special_affect";
import SpecialAffectParcelFactory from "../special_affect/special_affect_parcel_factory";
import { BindableData } from "./bindable_data";


export enum ABILITY {
  LOYAL = 0, // 侠义
  ATTACK = 1, // 勇武
  INTELIGENCE = 2, // 智慧
  TRUST = 3, // 信誉
  DEFEND = 4, // 防御
  AGILE = 5, // 灵敏
  STRENGTH = 6, // 体力

  POINT = 10,  // 可用点数
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
    for (let item in ABILITY) {
      this.abilities[item] = 0;
    }
  }

  toParcel(p: parcel) {
    p.writeString(this.name);
    p.writeString(this.imageSrc);
    p.writeNumberArray(this.abilities);
    p.writeInt(this.specials.length);
    this.specials.forEach(sp => {
      SpecialAffectParcelFactory.toParcel(sp, p);
    })
  }
  fromParcel(p: parcel) {
    this.name = p.readString();
    this.imageSrc = p.readString();
    let abilities = p.readNumberArray();
    for (let item in ABILITY) {
      this.abilities[item] = abilities[item] ? abilities[item] : 0;
    }
    let specialLen = p.readInt();
    this.specials = []
    for (let i = 0; i < specialLen; i++) {
      this.specials.push(
        SpecialAffectParcelFactory.fromParcel(p)
      );
    }
  }
}