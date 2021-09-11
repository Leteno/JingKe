import parcel from "../objects/parcel";
import { BindableAndSerializable, Serializable } from "../objects/serializable";

export class Goods extends BindableAndSerializable {
  count: number;
  cost: number;
  info: GoodsInfo;
  constructor(info: GoodsInfo = new GoodsInfo) {
    super();
    this.info = info;
    this.cost = info.cost;
  }

  toParcel(p: parcel) {
    p.writeInt(this.count);
    this.info.toParcel(p);
  }
  fromParcel(p: parcel) {
    this.count = p.readInt();
    this.info.fromParcel(p);
  }
}

export class GoodsInfo extends Serializable {
  name: string;
  cost: number;
  image: string;
  functional_text: string;
  constructor() {
    super();
  }

  toParcel(p: parcel) {
    p.writeString(this.name);
    p.writeInt(this.cost);
    p.writeString(this.image);
    p.writeString(this.functional_text);
  }
  fromParcel(p: parcel) {
    this.name = p.readString();
    this.cost = p.readInt();
    this.image = p.readString();
    this.functional_text = p.readString();
  }
}