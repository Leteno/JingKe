import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect";
import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import DialogueView from "../widgets/dialogue_view";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";
import Scene from "./scene";

export default class SimpleScene implements Scene {
  mainPanel: Panel;
  sceneCaption: TextView;
  sceneTitle: TextView;
  dialogueView: DialogueView;
  presetDialogues: Array<Dialogue>;

  canvasWidth: number;
  canvasHeight: number;

  sceneAnimationFinished: boolean;
  animators: Array<NumberLinearAnimator>;

  constructor(canvas: HTMLCanvasElement,
    caption: string, title: string) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.mainPanel = new Panel();
    this.sceneCaption = new TextView(caption);
    this.sceneTitle = new TextView(title);
    this.mainPanel.addView(this.sceneCaption);
    this.mainPanel.addView(this.sceneTitle);

    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.mainPanel.padding.left = 20;
    this.mainPanel.padding.right = 20;
    this.mainPanel.padding.bottom = 20;
    this.sceneCaption.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneTitle.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneCaption.margin.top = -50;

    this.animators = new Array<NumberLinearAnimator>();
    this.sceneCaption.textColor = "#FFFFFF";
    this.sceneTitle.textColor = "#FFFFFF";

    this.dialogueView = new DialogueView();
    this.dialogueView.forceWidth = canvas.width;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.dialogueView.layoutParam = new LayoutParams(
      Align.CENTER, Align.END
    );
    this.mainPanel.addView(this.dialogueView);

    this.presetDialogues = new Array<Dialogue>();
    this.sceneAnimationFinished = false;
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);

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
    titleFadeOut.onStop = () => {
      this.sceneAnimationFinished = true;
      this.presetDialogues.forEach(item => {
        this.dialogueView.addDialogue(item);
      })
    }
  }

  update(dt: number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    });
    this.dialogueView.updateTime(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    this.mainPanel.onclick(event);
  }

  addDialogue(data: Dialogue) {
    if (this.sceneAnimationFinished) {
      this.dialogueView.addDialogue(data);
    } else {
      this.presetDialogues.push(data);
    }
  }
}