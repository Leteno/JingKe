import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align, LayoutParams} from "../misc/layout"
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";
import { ClickEvent, PressEvent } from "../misc/event";
import SceneManager from "../scene/scene_manager";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  canvasWidth: number;
  canvasHeight: number;
  sceneManager: SceneManager;

  constructor(sceneManager: SceneManager, canvas: HTMLCanvasElement) {
    this.sceneManager = sceneManager;

    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.animators = new Array<Animator<number>>();
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }
  onStart(ctx: CanvasRenderingContext2D) {
    let textView = new TextView(new Text("荆轲刺秦王"));
    textView.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(textView);
    textView.textColor = "black";
    textView.textSize = 40;
    textView.margin.top = -100;
    textView.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("text is clicked");
      return true;
    }

    let startBtn = new TextView(new Text("开始游戏"));
    startBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(startBtn);
    startBtn.textColor = "black";
    startBtn.textSize = 24;
    startBtn.visible = false;
    startBtn.onclickInternal = (event: ClickEvent) : boolean => {
      this.sceneManager.switchScene("scene1");
      return true;
    }

    let configBtn = new TextView(new Text("配置"));
    configBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(configBtn);
    configBtn.textColor = "black";
    configBtn.textSize = 24;
    configBtn.margin.top = 60;
    configBtn.visible = false;
    configBtn.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("configBtn is clicked");
      return true;
    }

    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);


    let text:string = textView.text.content;
    let animatorTextViewString = new NumberLinearAnimator(
      0, textView.text.content.length, 1500
    )
    animatorTextViewString.onValChange = function(val: number) {
      textView.text.content = text.substring(0, Math.floor(val))
    }
    animatorTextViewString.onStop = function() {
      setTimeout(() => {
        startBtn.visible = true;
        configBtn.visible = true;
      }, 200);
    }
    this.animators.push(animatorTextViewString)
  }

  update(dt: number) {
    this.animators.forEach((animator => {
      animator.update(dt)
    }));
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