import Panel from "../widgets/panel";

export default interface Scene {
  update(dt: number)
  render(ctx: CanvasRenderingContext2D)
}