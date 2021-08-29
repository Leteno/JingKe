
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