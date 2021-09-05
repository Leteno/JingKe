import Parcel from "../objects/parcel";
import parcel from "../objects/parcel";
import { Serializable } from "../objects/serializable";

export class GameState implements Serializable {
  currentSceneName: string;
  // A simple way to add tag on states
  private states: Array<string>;

  static instance: GameState = new GameState();
  private constructor() {
    this.states = new Array<string>();
  }

  static create() {
    return new GameState();
  }

  switchToNewScene(sceneName: string) {
    this.currentSceneName = sceneName;
    this.states = new Array<string>();
  }
  hasEnterState(state: string) {
    return this.states.findIndex(item => item == state) >= 0;
  }
  recordState(state: string) {
    this.states.push(state);
  }
  toParcel(p: Parcel) {
    p.writeString(this.currentSceneName);
    p.writeStringArray(this.states);
  }
  fromParcel(p: Parcel) {
    this.currentSceneName = p.readString();
    this.states = p.readStringArray();
  }
}