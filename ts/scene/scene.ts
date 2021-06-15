import Panel from "../widgets/panel";

export default interface Scene {
  update()
  render(ctx: CanvasRenderingContext2D)
}