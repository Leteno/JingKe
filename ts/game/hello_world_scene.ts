import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Scene from "../scene/scene";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class HelloWorldScene implements Scene {
  mainPanel: Panel;
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;

    let text = new TextView("你好，过去");
    text.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(text);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx);
    this.mainPanel.layout();
  }

  update(dt: number) {
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
  }
}