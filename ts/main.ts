import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import SceneManager from "./scene/scene_manager"
import {timestamp} from "./misc/time"
import { ClickEvent } from "./misc/event";

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;

  last: number;
  sceneManager: SceneManager;

  constructor(canvas: HTMLCanvasElement) {
    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.last = timestamp();

    this.sceneManager = new SceneManager(this.ctx);
    let welcomeScene = new WelcomeScene(canvas);
    this.sceneManager.push("welcome", welcomeScene);
    this.sceneManager.switchScene("welcome");

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
    this.sceneManager.currentScene.update(dt);
  }

  render() {
    this.sceneManager.currentScene.render(this.ctx);
  }

  onclick(event: PointerEvent) {
    this.sceneManager.currentScene.onclick(ClickEvent.from(event))
  }
}