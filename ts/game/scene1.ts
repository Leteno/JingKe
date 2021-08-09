import Dialogue from "../data/dialogue";
import { ClickEvent, PressEvent } from "../misc/event";
import Scene from "../scene/scene";
import DialogueView from "../widgets/dialogue_view";
import Panel from "../widgets/panel";
import { Text } from "../widgets/textview";

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
    this.mainPanel.padding.left = 20;
    this.mainPanel.padding.right = 20;
    this.mainPanel.padding.bottom = 20;

    this.dialogueView = new DialogueView();
    this.dialogueView.forceWidth = canvas.width;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.mainPanel.addView(this.dialogueView);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      new Text("我叔父是荆轲，荆棘是我的名字。")
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      new Text("叔父被人杀了，")
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      new Text("而我却没有替他报仇..")
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      new Text("这里面的纠缠在我脑中挥之不去，请你耐心听我倾诉")
    ));
    this.dialogueView.addDialogue(new Dialogue(
      "荆棘",
      new Text("那年我 16 岁，而叔父还在燕都太子做门客，我去投奔叔父....")
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

  onpress(event: PressEvent) {
    this.mainPanel.onpress(event);
  }
}