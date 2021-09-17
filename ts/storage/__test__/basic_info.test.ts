
import Parcel from "../../objects/parcel";
import BasicInfo, { SaveInfo } from "../basic_info";

test("parcel", () => {
  let info = new BasicInfo();
  info.saveInfos = [
    new SaveInfo().setData("n1", "db1", "Nov"),
    new SaveInfo().setData("n2", "db2", "Dec"),
    new SaveInfo().setData("n3", "db3", "Jan"),
  ];
  let p = new Parcel();
  info.toParcel(p);

  let info2 = new BasicInfo();
  info2.fromParcel(p);
  expect(info2.saveInfos).toEqual([
    new SaveInfo().setData("n1", "db1", "Nov"),
    new SaveInfo().setData("n2", "db2", "Dec"),
    new SaveInfo().setData("n3", "db3", "Jan"),
  ]);
})