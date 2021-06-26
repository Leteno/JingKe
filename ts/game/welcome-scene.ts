import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align, LayoutParams} from "../misc/layout"
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";
import { ClickEvent } from "../misc/event";
import { config } from "yargs";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  canvasWidth: number;
  canvasHeight: number;
  constructor(canvas: HTMLCanvasElement) {
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
    textView.y = -100;
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
      console.log("startBtn is clicked");
      return true;
    }

    let configBtn = new TextView("配置");
    configBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(configBtn);
    configBtn.textColor = "black";
    configBtn.textSize = 24;
    configBtn.y = 60;
    configBtn.visible = false;
    configBtn.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("configBtn is clicked");
      return true;
    }

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = this.canvasWidth / 3;
    imageView.width = imageView.height = 100;

    this.mainPanel.measure(ctx);
    this.mainPanel.layout();

    let animatorImageViewY = new NumberLinearAnimator(
      0, this.canvasHeight * 2, 20000
    )
    animatorImageViewY.onValChange = function(val: number) {
      imageView.y = animatorImageViewY.getVal();
    }
    this.animators.push(animatorImageViewY)

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
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore();
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    this.mainPanel.onclick(event);
  }
}