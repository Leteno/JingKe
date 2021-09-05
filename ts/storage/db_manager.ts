import { DBInteface } from "./db_interface";
import { SimpleDb } from "./simple_db";

export default class DBManager {

  private db: DBInteface;
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
    this.db = new SimpleDb(dbName);
    if (this.reload_) {
      this.reload_(this.db);
    }
  }
  save() {
    if (this.save_) {
      this.save_(this.db);
    }
  }

  setReload(fn: (db: DBInteface)=>void) {
    this.reload_ = fn;
  }

  setSave(fn: (db: DBInteface)=>void) {
    this.save_ = fn;
  }

  getDb(): DBInteface {
    return this.db;
  }

  clearAllSave(dbName: string) {
    new SimpleDb(dbName).clearAll();
  }
}