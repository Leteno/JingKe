import Parcel from "../objects/parcel";
import { Serializable } from "../objects/serializable";

export default class BasicInfo extends Serializable {
  saveInfos: Array<SaveInfo>;
  constructor() {
    super();
    this.saveInfos = [];
    // By default setting:
    this.saveInfos.push(
      new SaveInfo().setData("<空>", "slot1", ""),
      new SaveInfo().setData("<空>", "slot2", ""),
      new SaveInfo().setData("<空>", "slot3", ""),
    )
  }

  toParcel(p: Parcel) {
    p.writeInt(this.saveInfos.length);
    this.saveInfos.forEach(info => {
      info.toParcel(p);
    });
  }
  fromParcel(p: Parcel) {
    let infoSize = p.readInt();
    this.saveInfos.splice(0);
    for (let i = 0; i < infoSize; i++) {
      let info = new SaveInfo();
      info.fromParcel(p);
      this.saveInfos.push(info);
    }
  }
}

export class SaveInfo extends Serializable {
  name: string;
  dbName: string;
  date: string;
  setData(name: string, dbName: string, date: string) : SaveInfo {
    this.name = name;
    this.dbName = dbName;
    this.date = date;
    return this;
  }

  toParcel(p: Parcel) {
    p.writeString(this.name);
    p.writeString(this.dbName);
    p.writeString(this.date);
  }
  fromParcel(p: Parcel) {
    this.name = p.readString();
    this.dbName = p.readString();
    this.date = p.readString();
  }
}