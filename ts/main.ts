import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import {timestamp} from "./misc/time"
import { ClickEvent } from "./misc/event";

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;

  last: number;
  currentScene: Scene

  constructor(canvas: HTMLCanvasElement) {
    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.last = timestamp();
    this.currentScene = new WelcomeScene(canvas);
    this.currentScene.onStart(this.ctx);

    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop
    );
    canvas.onclick = this.onclick.bind(this);
  }

  gameLoop() {
    let now = timestamp();
    let dt = now - this.last;
    this.update(dt);
    this.render();
    this.last = now;
    this.aniId = window.requestAnimationFrame(
      this.bindLoop
    );
  }

  update(dt: number) {
    this.currentScene.update(dt);
  }

  render() {
    this.currentScene.render(this.ctx);
  }

  onclick(event: PointerEvent) {
    this.currentScene.onclick(ClickEvent.from(event))
  }
}