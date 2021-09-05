import parcel from "../objects/parcel";
import { Serializable } from "../objects/serializable";

export class SpecialAffect extends Serializable {
  name: string;
  description: string;
  protected constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }
  toParcel(p: parcel) {
    p.writeString(this.name);
    p.writeString(this.description);
  }
  fromParcel(p: parcel) {
    this.name = p.readString();
    this.description = p.readString();
  }
}