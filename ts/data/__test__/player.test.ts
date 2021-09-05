
import Parcel from "../../objects/parcel";
import DBManager from "../../storage/db_manager";
import { Character } from "../character";
import {Event, Player} from "../player"
import Quest from "../quest";
import { QuestType } from "../quest_data";

test("player", () => {
  let player = Player.getInstance();

  expect(player.getChoose(Event.FRE_WHAT_LEARN))
    .toBe(Player.CHOOSE_NOT_FOUND);

  player.saveChoose(Event.FRE_WHAT_LEARN, 1);

  expect(player.getChoose(Event.FRE_WHAT_LEARN))
    .toBe(1);

  expect(player.getChoose(Event.FRE_WHAT_LOVE))
    .toBe(Player.CHOOSE_NOT_FOUND);
})

test("save and read", () => {
  let player = Player.getInstance();
  player.money = 596;
  player.character.name = "leteno";
  player.character.imageSrc = "test://img";

  let q = new Quest();
  q.type = QuestType.JingkeConfuzed;
  q.progress.push("Miss Jing's hand");
  q.progress.push("Dog hunter");
  q.done = true;
  let q2 = new Quest();
  q2.type = QuestType.YourConfuzed;
  q2.progress.push("Talk With Juzi");
  q2.progress.push("Taizi");
  q2.done = true;
  player.quests.push(q, q2);

  let parcel = new Parcel();
  player.toParcel(parcel);

  // Ruin the data.
  player.money += 1024;
  player.character.name = "change it";
  player.character.imageSrc = "lalalal";
  player.quests = [];

  player.fromParcel(parcel);

  expect(player.money).toBe(596);
  expect(player.character.name).toBe("leteno");
  expect(player.character.imageSrc).toBe("test://img");
  expect(player.quests.length).toBe(2);
  expect(player.quests[0].type).toBe(QuestType.JingkeConfuzed)
  expect(player.quests[0].progress).toEqual(["Miss Jing's hand", "Dog hunter"]);
  expect(player.quests[0].done).toBe(true);
  expect(player.quests[1].type).toBe(QuestType.YourConfuzed)
  expect(player.quests[1].progress).toEqual(["Talk With Juzi", "Taizi"]);
  expect(player.quests[1].done).toBe(true);
})