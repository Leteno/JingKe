import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align, LayoutParams} from "../misc/layout"
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";
import { ClickEvent } from "../misc/event";
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
    let textView = new TextView("荆轲刺秦王");
    textView.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(textView);
    textView.textColor = "black";
    textView.textSize = 40;
    textView.top = -100;
    textView.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("text is clicked");
      return true;
    }

    let startBtn = new TextView("开始游戏");
    startBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(startBtn);
    startBtn.textColor = "black";
    startBtn.textSize = 24;
    startBtn.visible = false;
    startBtn.onclickInternal = (event: ClickEvent) : boolean => {
      this.sceneManager.switchScene("helloWorld");
      return true;
    }

    let configBtn = new TextView("配置");
    configBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(configBtn);
    configBtn.textColor = "black";
    configBtn.textSize = 24;
    configBtn.top = 60;
    configBtn.visible = false;
    configBtn.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("configBtn is clicked");
      return true;
    }

    this.mainPanel.measure(ctx);
    this.mainPanel.layout();


    let text:string = textView.text;
    let animatorTextViewString = new NumberLinearAnimator(
      0, textView.text.length, 1500
    )
    animatorTextViewString.onValChange = function(val: number) {
      textView.text = text.substring(0, Math.floor(val))
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
}