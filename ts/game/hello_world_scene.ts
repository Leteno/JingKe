import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene";
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class HelloWorldScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>

  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;

    this.animators = new Array<Animator<number>>();

    let text = new TextView("你好，过去");
    text.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(text);

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.left = canvas.width / 3;
    imageView.forceWidth = imageView.forceHeight = 100;
    this.mainPanel.addView(imageView);

    let animatorImageViewY = new NumberLinearAnimator(
      0, canvas.height * 2, 20000
    )
    animatorImageViewY.onValChange = function(val: number) {
      imageView.y = animatorImageViewY.getVal();
    }
    this.animators.push(animatorImageViewY)

    let longText = new TextView("这是一个非常长，非常长的句子。我希望你能够帮忙换一下行");
    longText.layoutParam = new LayoutParams(Align.START, Align.CENTER)
    longText.top = 100;
    longText.left = 20;
    longText.right = 40;
    longText.debug = true;
    this.mainPanel.addView(longText);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx);
    this.mainPanel.layout();
  }

  update(dt: number) {
    console.log("helloworld dt: " + dt);
    this.animators.forEach(animator => {
      animator.update(dt);
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
  }
}