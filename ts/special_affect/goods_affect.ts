import { Prossession } from "../data/prossession";
import Assertion from "../misc/assertion";
import { SpecialAffect } from "./special_affect";

export abstract class GoodsAffect extends SpecialAffect {
  abstract affect(
    data: Prossession
  ) : boolean;
}

class GACostDiscount extends GoodsAffect {
  costDiscount: number;
  constructor(name: string, description: string, costDiscount: number) {
    super(name, description);
    this.costDiscount = costDiscount;
  }
  affect(data: Prossession): boolean {
    data.cost *= this.costDiscount;
    return true;
  }
}

class GACountChange extends GoodsAffect {
  countDelta: number;
  constructor(name: string, description: string, countDelta: number) {
    super(name, description);
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

export enum Goods_Type {
  GACostDiscount,
  GACountChange,
}
export class GoodsAffectFactory {
  static getGoodsAffect(t: Goods_Type, ...args:any[]):GoodsAffect|null {
    switch (t) {
      case Goods_Type.GACostDiscount:
        Assertion.expectTrue(args.length == 3);
        return new GACostDiscount(args[0], args[1], args[2]);
      case Goods_Type.GACountChange:
        Assertion.expectTrue(args.length == 3);
        return new GACountChange(args[0], args[1], args[2]);
    }
    return null;
  }
}