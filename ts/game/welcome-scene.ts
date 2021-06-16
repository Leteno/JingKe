import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  imageView: ImageView;
  animator: NumberLinearAnimator;
  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();

    let textView = new TextView("Hello World");
    this.mainPanel.addView(textView);
    textView.x = canvas.width / 2;
    textView.y = canvas.height / 2;

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = canvas.width / 3;
    imageView.width = imageView.height = 100;
    this.imageView = imageView;

    this.animator = new NumberLinearAnimator(
      0, canvas.height * 2, 20000
    )
  }

  update(dt: number) {
    this.animator.update(dt);
    this.imageView.y = this.animator.getVal();
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore();
    this.mainPanel.drawToCanvas(ctx);
  }
}