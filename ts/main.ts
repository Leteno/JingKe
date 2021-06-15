import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import ImageView from "./widgets/imageview"
import TextView from "./widgets/textview"

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;

  currentScene: Scene

  constructor(canvas: HTMLCanvasElement) {
    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.currentScene = new WelcomeScene(canvas);
    this.restart();
  }

  restart() {
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
    this.currentScene.update();
  }

  render() {
    this.currentScene.render(this.ctx);
  }
}