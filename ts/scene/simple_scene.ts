import Animator from "../animator/animator";
import { AnimatorSetBuilder } from "../animator/animator_set";
import { MeanWhileBuilder } from "../animator/meanwhile";
import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect";
import PlayerDescriptionView from "../compose/player_description_view";
import Dialogue from "../data/dialogue";
import { Player } from "../data/player";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import DialogueView from "../widgets/dialogue_view";
import OptionView, { Option } from "../widgets/option_view";
import Panel from "../widgets/panel";
import Sprite from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";
import Scene from "./scene";

export default abstract class SimpleScene implements Scene {
  private mainPanel: Panel;
  private sceneCaption: TextView;
  private sceneTitle: TextView;
  private dialogueView: DialogueView;
  private optionView: OptionView;
  private descriptionView: PlayerDescriptionView;

  canvasWidth: number;
  canvasHeight: number;

  private animators: Array<Animator<number>>;

  constructor(canvas: HTMLCanvasElement,
    caption: Text, title: Text) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.mainPanel = new Panel();

    // Put optionView in the beginning,
    // to capture click event first.
    this.optionView = new OptionView(canvas);

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

    this.animators = new Array<Animator<number>>();
    this.sceneCaption.textColor = "#FFFFFF";
    this.sceneTitle.textColor = "#FFFFFF";

    this.dialogueView = new DialogueView();
    this.dialogueView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.dialogueView.margin.left = 20;
    this.dialogueView.margin.right = 20;
    this.dialogueView.margin.bottom = 20;
    this.dialogueView.layoutParam.xcfg = Align.CENTER;
    this.dialogueView.layoutParam.ycfg = Align.END;
    this.dialogueView.bgColor = "#f5bb10";

    this.descriptionView = new PlayerDescriptionView();
    this.descriptionView.visible = false;
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
    this.optionView.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.optionView.layout(this.canvasWidth, this.canvasHeight);
    this.dialogueView.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.dialogueView.layout(this.canvasWidth, this.canvasHeight);
    this.descriptionView.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.descriptionView.layout(this.canvasWidth, this.canvasHeight);

    let captionFadeIn = textAlpha(true, 2000, this.sceneCaption);
    let titleFadeIn = textAlpha(true, 2500, this.sceneTitle);
    let captionFadeOut = textAlpha(false, 2000, this.sceneCaption);
    let titleFadeOut = textAlpha(false, 2000, this.sceneTitle);
    let fadeOut = new MeanWhileBuilder()
      .join(captionFadeOut)
      .join(titleFadeOut)
      .build();
    let animation = new AnimatorSetBuilder()
      .after(captionFadeIn)
      .after(titleFadeIn)
      .after(fadeOut)
      .build();
    animation.onStop = () => {
      this.onPageReady();
    }
    this.animators.push(animation);
  }

  abstract onPageReady();

  update(dt: number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    });
    this.dialogueView.updateTime(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
    this.dialogueView.drawToCanvas(ctx);
    this.optionView.drawToCanvas(ctx);
    this.descriptionView.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    if (this.descriptionView.onclick(event)) {
      return;
    }
    if (this.optionView.onclick(event)) {
      return;
    }
    if (this.dialogueView.onclick(event)) {
      return;
    }
    this.mainPanel.onclick(event);
  }

  addDialogue(data: Dialogue) {
    this.dialogueView.addDialogue(data);
  }

  hideDialogue() {
    this.dialogueView.visible = false;
  }

  showOptionView(title: Text, options: Array<Option>) {
    this.optionView.show(
      title, options
    );
  }

  addAnimator(animator: Animator<number>) {
    this.animators.push(animator);
  }

  addView(view: Sprite) {
    this.mainPanel.addView(view);
  }

  forceRepaint() {
    this.mainPanel.setIsDirty(true);
  }

  setOnDialogueFinish (fn: ()=>void) {
    this.dialogueView.onDialogueFinished = fn;
  }

  showPlayerDescription(player: Player) {
    this.descriptionView.setPlayer(player);
    this.descriptionView.visible = true;
  }
}