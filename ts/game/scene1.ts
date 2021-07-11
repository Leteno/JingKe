import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import Scene from "../scene/scene";
import DialogueView from "../widgets/dialogue_view";
import Panel from "../widgets/panel";

export default class Scene1 implements Scene {
  mainPanel: Panel;
  dialogueView: DialogueView;

  canvasWidth: number;
  canvasHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;

    this.dialogueView = new DialogueView();
    this.dialogueView.forceWidth = canvas.width;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.mainPanel.addView(this.dialogueView);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      "我叔父是荆轲，荆棘是我的名字。"
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      "叔父被人杀了，"
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      "而我却没有替他报仇.."
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      "这里面的纠缠在我脑中挥之不去，请你耐心听我倾诉"
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      "那年我 16 岁，而叔父还在燕都太子做门客，我去投奔叔父...."
    ));

    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
  }
  update(dt: number) {
    this.dialogueView.updateTime(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    this.mainPanel.onclick(event);
  }

}