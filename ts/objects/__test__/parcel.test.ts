import Parcel from "../parcel"

test("test enlarge", ()=> {
  let p = new Parcel(8);
  expect(p.getLength()).toBe(8);

  // This don't need enlarge
  p.writeInt(123);
  expect(p.getLength()).toBe(8);

  // This need enlarge
  p.writeInt(345);
  expect(p.getLength()).toBe(16);

  // Value should be correct.
  expect(p.readInt()).toBe(123);
  expect(p.readInt()).toBe(345);
})

test("toString and fromString", () => {
  let p = new Parcel();
  p.writeInt(123);
  p.writeInt(456);
  expect(p.readInt()).toBe(123);
  expect(p.readInt()).toBe(456);

  let data = p.toString();
  let p0 = new Parcel();
  p0.fromString(data);
  
  expect(p0.readInt()).toBe(123);
  expect(p0.readInt()).toBe(456);
})

test("write and read", () => {
  let p = new Parcel();
  p.writeInt(123);
  p.writeString("Miss");

  let iArray = new Array<number>();
  iArray.push(12);
  p.writeNumberArray(iArray);

  let sArray = new Array<string>();
  sArray.push("1");
  sArray.push("980");
  p.writeStringArray(sArray);

  let pArray = new Array<Parcel>();
  let px1 = new Parcel();
  px1.writeInt(8424);
  let px2 = new Parcel();
  px2.writeString("watermelon");
  pArray.push(px1);
  pArray.push(px2);
  p.writeArray(pArray);

  expect(p.readInt()).toBe(123);
  expect(p.readString()).toBe("Miss");

  let array1 = p.readNumberArray();
  expect(array1).not.toBeNull();
  expect(array1.pop()).toBe(12);

  let array2 = p.readStringArray();
  expect(array2).not.toBeNull();
  expect(array2.pop()).toBe("980");
  expect(array2.pop()).toBe("1");

  let array3 = p.readArray();
  expect(array3).not.toBeNull();
  expect(array3.pop()?.readInt()).toBe(8424);
  expect(array3.pop()?.readString()).toBe("watermelon");
})