import { Goods } from "../data/goods";
import Assertion from "../misc/assertion";
import Parcel from "../objects/parcel";
import { SpecialAffect } from "./special_affect";

export abstract class GoodsAffect extends SpecialAffect {
  abstract affect(
    data: Goods
  ) : boolean;
}

class GACostDiscount extends GoodsAffect {
  costDiscount: number;
  constructor(name: string, description: string, costDiscount: number) {
    super(name, description);
    this.costDiscount = costDiscount;
  }
  affect(data: Goods): boolean {
    data.cost = Math.round(data.cost * this.costDiscount);
    return true;
  }

  toParcel(p: Parcel) {
    super.toParcel(p);
    p.writeDouble(this.costDiscount);
  }
  fromParcel(p: Parcel) {
    super.fromParcel(p);
    this.costDiscount = p.readDouble();
  }
}

class GACountChange extends GoodsAffect {
  countDelta: number;
  constructor(name: string, description: string, countDelta: number) {
    super(name, description);
    this.countDelta = countDelta;
  }
  affect(data: Goods): boolean {
    data.count += this.countDelta;
    if (data.count < 0)  {
      data.count = 0;
    }
    return true;
  }
  toParcel(p: Parcel) {
    super.toParcel(p);
    p.writeInt(this.countDelta);
  }
  fromParcel(p: Parcel) {
    super.fromParcel(p);
    this.countDelta = p.readInt();
  }
}

export enum Goods_Type {
  GACostDiscount = 0,
  GACountChange = 1,
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

  static toParcel(sp: GoodsAffect, p: Parcel) {
    if (sp instanceof GACostDiscount) {
      p.writeInt(Goods_Type.GACostDiscount);
      sp.toParcel(p);
    } else if (sp instanceof GACountChange) {
      p.writeInt(Goods_Type.GACountChange);
      sp.toParcel(p);
    }
  }

  static fromParcel(p:Parcel): GoodsAffect {
    let type = p.readInt();
    switch(type) {
      case Goods_Type.GACostDiscount: {
        let ret = new GACostDiscount("", "", 0);
        ret.fromParcel(p);
        return ret;
      }
      case Goods_Type.GACountChange: {
        let ret = new GACountChange("", "", 0);
        ret.fromParcel(p);
        return ret;
      }
    }
    return null;
  }
}