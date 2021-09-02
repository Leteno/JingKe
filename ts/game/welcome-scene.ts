import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align, LayoutParams, LayoutType, Specify} from "../misc/layout"
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";
import { ClickEvent, PressEvent } from "../misc/event";
import SceneManager from "../scene/scene_manager";
import LinearLayout, { Orientation } from "../widgets/linear_layout";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  canvasWidth: number;
  canvasHeight: number;
  title: TextView;
  options: LinearLayout;

  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.animators = new Array<Animator<number>>();
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.title = new TextView(new Text("荆轲刺秦王"));
    this.title.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(this.title);
    this.title.textSize = 40;
    this.title.margin.top = -100;

    this.options = new LinearLayout(Orientation.VERTICAL);
    this.options.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.options.layoutParam.xcfg = Align.CENTER;
    this.options.layoutParam.ycfg = Align.CENTER;
    this.options.visible = false;
    this.mainPanel.addView(this.options);
    let startBtn = new TextView(new Text("开始游戏"));
    startBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.options.addView(startBtn);
    startBtn.textSize = 24;
    startBtn.onclickInternal = (event: ClickEvent) : boolean => {
      SceneManager.getInstance().switchScene("act1");
      return true;
    }

    let configBtn = new TextView(new Text("配置"));
    configBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.options.addView(configBtn);
    configBtn.textSize = 24;
    configBtn.margin.top = 60;
    configBtn.onclickInternal = (event: ClickEvent) : boolean => {
      console.log("configBtn is clicked");
      return true;
    }
  }
  onStart(ctx: CanvasRenderingContext2D) {

    let that:WelcomeScene = this;
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, Specify.NONE);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);

    let animatorTextViewString = new NumberLinearAnimator(
      0, this.title.text.content.length, 1500
    )
    animatorTextViewString.onValChange = function(val: number) {
      that.title.showTextLength = val;
    };
    animatorTextViewString.onStop = function() {
      setTimeout(() => {
        that.options.visible = true;
      }, 500);
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