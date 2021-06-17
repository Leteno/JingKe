import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();

    let textView = new TextView("荆轲刺秦王");
    this.mainPanel.addView(textView);
    textView.x = canvas.width / 4;
    textView.y = canvas.height / 5;
    textView.textColor = "black";
    textView.textSize = 40;

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = canvas.width / 3;
    imageView.width = imageView.height = 100;

    this.animators = new Array<Animator<number>>();

    let animatorImageViewY = new NumberLinearAnimator(
      0, canvas.height * 2, 20000
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