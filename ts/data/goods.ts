import parcel from "../objects/parcel";
import { BindableAndSerializable } from "../objects/serializable";

export class Goods extends BindableAndSerializable {
  name: string;
  cost: number;
  count: number;
  image: string;
  functional_text: string;

  toParcel(p: parcel) {
    p.writeString(this.name);
    p.writeInt(this.cost);
    p.writeInt(this.count);
    p.writeString(this.image);
    p.writeString(this.functional_text);
  }
  fromParcel(p: parcel) {
    this.name = p.readString();
    this.cost = p.readInt();
    this.count = p.readInt();
    this.image = p.readString();
    this.functional_text = p.readString();
  }
}