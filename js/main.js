import Panel from "./widgets/panel";
import TextView from "./widgets/textview"

const ctx = canvas.getContext('2d');

export default class Main {
  constructor() {
    // id of requestAnimationFrame
    this.aniId = 0;
    this.mainPanel = new Panel();
    this.restart();
  }

  restart() {
    this.mainPanel.removeAllViews();
    let textView = new TextView("Hello World");
    this.mainPanel.addView(textView);
    textView.x = canvas.width / 2;
    textView.y = canvas.height / 2;

    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.gameLoop,
      canvas
    );
  }

  gameLoop() {
    this.update();
    this.render();
    this.aniId = window.requestAnimationFrame(
      this.gameLoop,
      canvas
    );
  }

  update() {
    // do nothing
  }

  render() {
    this.mainPanel.drawToCanvas(ctx);
  }
}