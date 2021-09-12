import { ClickEvent, DragEvent, PressEvent } from "../misc/event";
import Panel from "../widgets/panel";

export default interface Scene {
  // We could doMeasure in onStart
  onStart(ctx: CanvasRenderingContext2D)
  update(dt: number)
  render(ctx: CanvasRenderingContext2D)
  onclick(event:ClickEvent)
  onpress(event:PressEvent)
  ondrag(event: DragEvent)
}