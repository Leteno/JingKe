
import Parcel from "./parcel"

export abstract class Serializable {
  abstract toParcel(): Parcel;
  abstract fromParcel(p: Parcel);
}

export class SerializableDemo implements Serializable {
  name: string;
  age: number;
  word: string;
  toParcel(): Parcel {
    let parcel = new Parcel();
    parcel.writeString(this.name);
    parcel.writeInt(this.age);
    parcel.writeString(this.word);
    return parcel;
  }
  fromParcel(p: Parcel) {
    this.name = p.readString();
    this.age = p.readInt();
    this.word = p.readString();
  }
}