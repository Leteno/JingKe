import Assertion from "../misc/assertion";
import Parcel from "../objects/parcel";
import { GoodsAffect, GoodsAffectFactory } from "./goods_affect";
import { LabelAffect } from "./label_affect";
import { SpecialAffect } from "./special_affect";

enum AffectType {
  Unknown = 0,
  GoodsAffect = 1,
  LabelAffect = 2,
}
export default class SpecialAffectParcelFactory {
  static toParcel(sp: SpecialAffect, p: Parcel) {

    if (sp instanceof GoodsAffect) {
      p.writeInt(AffectType.GoodsAffect);
      GoodsAffectFactory.toParcel(sp, p);
    } else if (sp instanceof LabelAffect) {
      p.writeInt(AffectType.LabelAffect);
      // TODO
    } else {
      sp.toParcel(p);
    }
  }
  static fromParcel(p: Parcel): SpecialAffect {
    let type = p.readInt();
    if (type == AffectType.GoodsAffect) {
      return GoodsAffectFactory.fromParcel(p);
    }
    if (type == AffectType.LabelAffect) {
      // TODO
    }
  }
}