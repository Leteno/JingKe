import Parcel from "../objects/parcel";

export interface DBInteface {
  getData(name: string): Parcel;
  saveData(name: string, parcel: Parcel);
  clearAll();
}