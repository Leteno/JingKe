import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align} from "../misc/layout"
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  canvasWidth: number;
  canvasHeight: number;
  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel(0, 0, canvas.width, canvas.height);
    this.animators = new Array<Animator<number>>();
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }
  onStart(ctx: CanvasRenderingContext2D) {
    let textView = new TextView("荆轲刺秦王");
    this.mainPanel.addView(textView, Align.CENTER, Align.CENTER);
    textView.textColor = "black";
    textView.textSize = 40;
    textView.measure(ctx);

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = this.canvasWidth / 3;
    imageView.width = imageView.height = 100;

    let animatorImageViewY = new NumberLinearAnimator(
      0, this.canvasHeight * 2, 20000
    )
    animatorImageViewY.onValChange = function(val: number) {
      imageView.y = animatorImageViewY.getVal();
    }
    this.animators.push(animatorImageViewY)

    let text:string = textView.text;
    let animatorTextViewString = new NumberLinearAnimator(
      0, textView.text.length, 2000
    )
    animatorTextViewString.onValChange = function(val: number) {
      textView.text = text.substring(0, Math.floor(val))
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
}