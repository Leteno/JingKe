import Parcel from "../objects/parcel";
import { DBInteface } from "./db_interface";

// Use |localStorage| from weapp-adapter.js, for data
// saving and reading.
export class SimpleDb implements DBInteface {
  dbName: string;
  constructor(dbName: string) {
    this.dbName = dbName;
  }
  getData(name: string) {
    let read = localStorage.getItem(this.keyFormat(name));
    let out = new Parcel();
    if (read) {
      out.fromString(read);
    }
    return out;
  }
  saveData(name: string, parcel: Parcel) {
    return localStorage.setItem(
      this.keyFormat(name),
      parcel.toString()
    );
  }

  keyFormat(name: string): string {
    return this.dbName + "-" + name;
  }

  clear(name: string) {
    localStorage.removeItem(this.keyFormat(name));
  }

  clearAll() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith(this.dbName)) {
        localStorage.removeItem(key);
      }
    }
  }
}