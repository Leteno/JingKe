import ImageView from "./widgets/imageview"
import Panel from "./widgets/panel";
import TextView from "./widgets/textview"

export default class Main {
  aniId: number;
  mainPanel: Panel;
  bindLoop: any;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    // id of requestAnimationFrame
    this.aniId = 0;
    this.mainPanel = new Panel();
    this.bindLoop = this.gameLoop.bind(this);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.restart();
  }

  restart() {
    this.mainPanel.removeAllViews();

    let textView = new TextView("Hello World");
    this.mainPanel.addView(textView);
    textView.x = this.canvas.width / 2;
    textView.y = this.canvas.height / 2;

    let imageView = new ImageView("res/artichoke_PNG30.png");
    this.mainPanel.addView(imageView);
    imageView.x = this.canvas.width / 3;
    imageView.y = this.canvas.width / 4;
    imageView.width = imageView.height = 100;

    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop
    );
  }

  gameLoop() {
    this.update();
    this.render();
    this.aniId = window.requestAnimationFrame(
      this.bindLoop
    );
  }

  update() {
    // do nothing
  }

  render() {
    this.mainPanel.drawToCanvas(this.ctx);
  }
}