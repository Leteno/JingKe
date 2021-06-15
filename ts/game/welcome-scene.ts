import Scene from "../scene/scene"
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView from "../widgets/textview";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();

    let textView = new TextView("Hello World");
    this.mainPanel.addView(textView);
    textView.x = canvas.width / 2;
    textView.y = canvas.height / 2;

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = canvas.width / 3;
    imageView.y = canvas.width / 4;
    imageView.width = imageView.height = 100;
  }

  update() {
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }
}