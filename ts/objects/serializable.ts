
import { BindableData } from "../data/bindable_data";
import Parcel from "./parcel"

export abstract class Serializable {
  abstract toParcel(p: Parcel);
  abstract fromParcel(p: Parcel);
}

export abstract class BindableAndSerializable extends BindableData implements Serializable {
  abstract toParcel(p: Parcel);
  abstract fromParcel(p: Parcel);
}

export class SerializableDemo implements Serializable {
  name: string;
  age: number;
  word: string;
  toParcel(p: Parcel) {
    p.writeString(this.name);
    p.writeInt(this.age);
    p.writeString(this.word);
  }
  fromParcel(p: Parcel) {
    this.name = p.readString();
    this.age = p.readInt();
    this.word = p.readString();
  }
}