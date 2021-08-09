
import { ClickEvent, PressEvent } from "../../misc/event";
import Scene from "../scene"

export default class TestScene implements Scene {
  onpress(event: PressEvent) {
  }
  onStart(ctx: CanvasRenderingContext2D) {
  }
  update(dt: number) {
  }
  render(ctx: CanvasRenderingContext2D) {
  }
  onclick(event: ClickEvent) {
  }
}

test("ignore", ()=>{})