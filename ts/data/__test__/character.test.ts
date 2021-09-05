import Parcel from "../../objects/parcel";
import { Character } from "../character"
import { Specials } from "../specials";

test("parcel", () => {
  let ch = new Character();
  ch.name = "juzhen";
  ch.imageSrc = "test://a";
  ch.abilities[0] = 33;
  ch.specials.push(Specials.getInstance().brave);
  ch.specials.push(Specials.getInstance().kouruoxuanhe);

  let p = new Parcel();
  ch.toParcel(p);

  let out = new Character();
  out.fromParcel(p);
  expect(out.name).toBe("juzhen");
  expect(out.imageSrc).toBe("test://a");
  expect(out.abilities[0]).toBe(33);
  expect(out.specials[0]).toEqual(Specials.getInstance().brave);
  expect(out.specials[1]).toEqual(Specials.getInstance().kouruoxuanhe);
})