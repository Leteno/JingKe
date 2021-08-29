
// 这类 affect 只作为 label，不作为计算依据

import Assertion from "../misc/assertion";
import { SpecialAffect } from "./special_affect";

export enum Label_Type {
  Brave,
  Xianting,
  yiboyuntian
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
    Assertion.expectTrue(args.length == 2);
    return new LabelAffect(args[0], args[1], t);
  }
}