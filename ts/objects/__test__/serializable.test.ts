
import Parcel from "../parcel";
import { SerializableDemo } from "../serializable"

test("simple", () => {
  let demo = new SerializableDemo();
  demo.name = "郑大虾";
  demo.age = 12;
  demo.word = "Miss you.";
  let p = demo.toParcel();
  let demo2 = new SerializableDemo();
  demo2.fromParcel(p);
  expect(demo2.word).toBe("Miss you.")
  expect(demo2.name).toBe("郑大虾");
  expect(demo2.age).toBe(12);
})

test("string", () => {
  let demo = new SerializableDemo();
  demo.name = "郑大虾";
  demo.age = 12;
  demo.word = "Miss you.";
  let p = demo.toParcel();
  let pData = p.toString();

  let p2 = new Parcel();
  p2.fromString(pData);
  let demo2 = new SerializableDemo();
  demo2.fromParcel(p2);
  expect(demo2.word).toBe("Miss you.")
  expect(demo2.name).toBe("郑大虾");
  expect(demo2.age).toBe(12);
})