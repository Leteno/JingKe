
import Parcel from "../../objects/parcel";
import {GameState} from "../game_state"

test("state check", () => {
  let state = GameState.create();
  state.recordState("hello");
  state.recordState("world");
  expect(state.hasEnterState("hello")).toBe(true);
  expect(state.hasEnterState("world")).toBe(true);
})

test("switch logic", () => {
  let state = GameState.create();
  state.recordState("hello");
  expect(state.hasEnterState("hello")).toBe(true);

  state.switchToNewScene("new Scene");
  expect(state.currentSceneName).toBe("new Scene");
  expect(state.hasEnterState("hello")).toBe(false);
})

test("parcel test", () => {
  let state = GameState.create();
  state.currentSceneName = "abc";
  state.recordState("hello");
  state.recordState("world");

  let p = new Parcel();
  state.toParcel(p);
  let state2 = GameState.create();
  state2.fromParcel(p);

  expect(state2.currentSceneName).toBe("abc");
  expect(state2.hasEnterState("hello")).toBe(true);
  expect(state2.hasEnterState("world")).toBe(true);
})