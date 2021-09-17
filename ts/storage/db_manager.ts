import Parcel from "../objects/parcel";
import BasicInfo from "./basic_info";
import { DBInteface } from "./db_interface";
import { SimpleDb } from "./simple_db";

export default class DBManager {

  private db: DBInteface;
  private dbName: string;
  private reload_: (db: DBInteface)=>void;
  private save_: (db: DBInteface)=>void;

  private static manager:DBManager = new DBManager();
  private constructor() {
    this.use("default");
  }

  static getInstance() {
    return DBManager.manager;
  }

  use(dbName: string) {
    this.dbName = dbName;
    this.db = new SimpleDb(dbName);
    if (this.reload_) {
      this.reload_(this.db);
    }
  }
  save() {
    if (this.save_) {
      this.save_(this.db);
    }
    this.setSaveInfo(this.dbName, this.dbName, this.getDateString());
  }

  setReloadFn(fn: (db: DBInteface)=>void) {
    this.reload_ = fn;
  }

  setSaveFn(fn: (db: DBInteface)=>void) {
    this.save_ = fn;
  }

  getDb(): DBInteface {
    return this.db;
  }

  clearAllSave(dbName: string) {
    new SimpleDb(dbName).clearAll();
    this.setSaveInfo(dbName, "<空>", "");
  }

  getDateString() {
    return new Date().toDateString();
  }

  getSaveInfos() {
    let basicInfo = new BasicInfo();
    let p = new SimpleDb("basic").getData("info");
    if (!p.isEmpty()) {
      basicInfo.fromParcel(p);
    }
    return basicInfo.saveInfos;
  }

  private setSaveInfo(dbName: string, name:string, date:string) {
    let basicDb = new SimpleDb("basic");
    let basicInfo = new BasicInfo();
    let p = basicDb.getData("info");
    if (!p.isEmpty()) {
      basicInfo.fromParcel(p);
    }
    basicInfo.saveInfos.filter(info => info.dbName == dbName)
      .forEach(info => {
        info.name = name;
        info.date = date;
      });
    let out = new Parcel();
    basicInfo.toParcel(out);
    basicDb.saveData("info", out);
  }
}
