
import DBManager from "../../storage/db_manager";
import { Character } from "../character";
import {Event, Player} from "../player"

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
  player.saveToDb();

  // Ruin the data.
  player.money += 1024;
  player.character.name = "change it";
  player.character.imageSrc = "lalalal";

  player.readFromDb();

  expect(player.money).toBe(596);
  expect(player.character.name).toBe("leteno");
  expect(player.character.imageSrc).toBe("test://img");
})