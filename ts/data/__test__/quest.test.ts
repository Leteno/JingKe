
import Parcel from "../../objects/parcel";
import Quest from "../quest"
import { QuestType } from "../quest_data";

test("parcel", () => {
  let q = new Quest();
  q.type = QuestType.JingkeConfuzed;
  q.progress.push("Miss Jing's hand");
  q.progress.push("Dog hunter");
  q.done = true;
  let parcel = new Parcel();
  q.toParcel(parcel);

  let out = new Quest();
  out.fromParcel(parcel);
  expect(out.type).toBe(QuestType.JingkeConfuzed);
  expect(out.progress).toEqual(["Miss Jing's hand", "Dog hunter"]);
  expect(out.done).toBe(true);
})