import { DBInteface } from "./db_interface";
import { SimpleDb } from "./simple_db";

export default class DBManager {

  private db: DBInteface;

  private static manager:DBManager = new DBManager();
  private constructor() {
    this.use("default");
  }

  static getInstance() {
    return DBManager.manager;
  }

  use(dbName: string) {
    this.db = new SimpleDb(dbName);
  }

  getDb(): DBInteface {
    return this.db;
  }
}