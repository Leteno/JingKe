import { Prossession } from "../data/prossession";
import Assertion from "../misc/assertion";
import { SpecialAffect } from "./special_affect";

export abstract class GoodsAffect extends SpecialAffect {
  abstract affect(
    data: Prossession
  ) : boolean;
}

class GAEmpty extends GoodsAffect {
  affect(data: Prossession): boolean {
    return false;
  }
}

class GACostDiscount extends GoodsAffect {
  costDiscount: number;
  constructor(costDiscount: number) {
    super();
    this.costDiscount = costDiscount;
  }
  affect(data: Prossession): boolean {
    data.cost *= this.costDiscount;
    return true;
  }
}

class GACountChange extends GoodsAffect {
  countDelta: number;
  constructor(countDelta: number) {
    super();
    this.countDelta = countDelta;
  }
  affect(data: Prossession): boolean {
    data.count += this.countDelta;
    if (data.count < 0)  {
      data.count = 0;
    }
    return true;
  }
}

export enum TYPE {
  UNKNOWN = -1,
  GACostDiscount = 0,
  GACountChange = 1,
}
export class GoodsAffectFactory {
  static getGoodsAffect(t: TYPE, ...args:any[]):GoodsAffect {
    switch (t) {
      case TYPE.GACostDiscount:
        Assertion.expectTrue(args.length == 1);
        return new GACostDiscount(args[0]);
      case TYPE.GACountChange:
        Assertion.expectTrue(args.length == 1);
        return new GACountChange(args[0]);
    }
    return new GAEmpty();
  }
}