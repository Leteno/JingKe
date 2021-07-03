import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";
import Scene from "./scene";

export default class SimpleScene implements Scene {
  mainPanel: Panel;
  sceneCaption: TextView;
  sceneTitle: TextView;

  animators: Array<NumberLinearAnimator>;

  constructor(canvas: HTMLCanvasElement,
    caption: string, title: string) {
    this.mainPanel = new Panel();
    this.sceneCaption = new TextView(caption);
    this.sceneTitle = new TextView(title);
    this.mainPanel.addView(this.sceneCaption);
    this.mainPanel.addView(this.sceneTitle);

    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.sceneCaption.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneTitle.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneCaption.top = -50;

    this.animators = new Array<NumberLinearAnimator>();
    this.sceneCaption.textColor = "#FFFFFF";
    this.sceneTitle.textColor = "#FFFFFF";
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx);
    this.mainPanel.layout();

    let captionFadeIn = textAlpha(true, 2000, this.sceneCaption);
    this.animators.push(captionFadeIn);
    let titleFadeIn = textAlpha(true, 2500, this.sceneTitle);
    captionFadeIn.onStop = () => {
      this.animators.push(titleFadeIn);
    }

    let captionFadeOut = textAlpha(false, 2000, this.sceneCaption);
    let titleFadeOut = textAlpha(false, 2000, this.sceneTitle);
    titleFadeIn.onStop = () => {
      this.animators.push(captionFadeOut);
      this.animators.push(titleFadeOut);
    }
  }

  update(dt: number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    this.mainPanel.onclick(event);
  }
}