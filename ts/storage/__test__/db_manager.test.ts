
import { SaveInfo } from "../basic_info";
import DBManager from "../db_manager"

test("saveDate", ()=> {
  let manager = DBManager.getInstance();
  expect(manager.getSaveInfos()).toEqual([
    new SaveInfo().setData("<空>", "slot1", ""),
    new SaveInfo().setData("<空>", "slot2", ""),
    new SaveInfo().setData("<空>", "slot3", ""),
  ])
  manager.use("slot1");
  manager.getDateString = () => {
    return "Today is the day after yesterday";
  }
  manager.save();
  expect(manager.getSaveInfos()).toEqual([
    new SaveInfo().setData("slot1", "slot1", "Today is the day after yesterday"),
    new SaveInfo().setData("<空>", "slot2", ""),
    new SaveInfo().setData("<空>", "slot3", ""),
  ])
})