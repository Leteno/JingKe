import Parcel from "../../objects/parcel";
import {SimpleDb} from "../simple_db"

function createSimpleParcel(n: number, s: string): Parcel {
  let p = new Parcel();
  p.writeInt(n);
  p.writeString(s);
  return p;
}

function examSimpleParcel(p: Parcel, n: number, s: string) {
  expect(p.readInt()).toBe(n);
  expect(p.readString()).toBe(s);
}

test("one parcel", () => {
  let db = new SimpleDb("simple");
  db.saveData("name", createSimpleParcel(
    1,
    "Hello world"
  ));

  let p = db.getData("name");
  examSimpleParcel(p, 1, "Hello world");
})

test("several parcel", () => {
  let db = new SimpleDb("simple");
  db.saveData("student", createSimpleParcel(
    1, "leteno"
  ));
  db.saveData("teacher", createSimpleParcel(
    2, "every clever man/women"
  ));

  examSimpleParcel(
    db.getData("student"),
    1, "leteno"
  );
  examSimpleParcel(
    db.getData("teacher"),
    2, "every clever man/women"
  );
})

test("several db", ()=> {
  let db1 = new SimpleDb("db1");
  db1.saveData("student", createSimpleParcel(
    1, "leteno"
  ));
  let db2 = new SimpleDb("db1");
  db2.saveData("teacher", createSimpleParcel(
    2, "every clever man/women"
  ));

  examSimpleParcel(
    db1.getData("student"),
    1, "leteno"
  );
  examSimpleParcel(
    db2.getData("teacher"),
    2, "every clever man/women"
  );
})