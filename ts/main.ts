import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import SceneManager from "./scene/scene_manager"
import {timestamp} from "./misc/time"
import { ClickEvent } from "./misc/event";
import HelloWorldScene from "./game/hello_world_scene";

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  last: number;
  sceneManager: SceneManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.last = timestamp();

    this.sceneManager = new SceneManager(this.ctx);
    let welcomeScene = new WelcomeScene(this.sceneManager, canvas);
    this.sceneManager.push("welcome", welcomeScene);
    this.sceneManager.switchScene("welcome");

    let helloWorldScene = new HelloWorldScene(canvas);
    this.sceneManager.push("helloWorld", helloWorldScene);

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
    this.clearScreen();
    this.sceneManager.currentScene.render(this.ctx);
  }

  clearScreen() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.restore();
  }

  onclick(event: PointerEvent) {
    this.sceneManager.currentScene.onclick(ClickEvent.from(event))
  }
}