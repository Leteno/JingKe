
// 这类 affect 只作为 label，不作为计算依据

import Assertion from "../misc/assertion";
import Parcel from "../objects/parcel";
import { SpecialAffect } from "./special_affect";

export enum Label_Type {
  SimpleAndNaive,
  Brave,
  Xianting,
  Yiboyuntian
}

export class LabelAffect extends SpecialAffect {
  type: Label_Type;
  constructor(name: string, description: string, type: Label_Type) {
    super(name, description);
    this.type = type;
  }
}

export class LabelAffectFactory {
  static getLabelAffect(t: Label_Type, ...args:any[]):LabelAffect {
    Assertion.expectTrue(args.length == 0);
    let name: string, desc: string;
    switch(t) {
      case Label_Type.SimpleAndNaive:
        name = "朴素"
        desc = "很朴素，不知道未来有没有奇遇"
        break;
      case Label_Type.Brave:
        name = "勇敢"
        desc = "遇到攻击力比自己高的，攻击力+3"
        break;
      case Label_Type.Xianting:
        name = "闲庭"
        desc = "由于你的步伐过于冷静，正常情况下不会遭遇捕快"
        break;
      case Label_Type.Yiboyuntian:
        name = "义薄云天"
        desc = "任何义士遇到困难，你都会伸出援手"
        break;
      default:
        console.log("unresolve type: " + t);
    }
    Assertion.expectTrue(name != undefined);
    Assertion.expectTrue(desc != undefined);
    return new LabelAffect(name, desc, t);
  }

  static toParcel(sp: LabelAffect, p: Parcel) {
    p.writeInt(sp.type);
  }

  static fromParcel(p: Parcel): LabelAffect {
    let type = p.readInt();
    return this.getLabelAffect(type);
  }
}