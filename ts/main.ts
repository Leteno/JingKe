import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import SceneManager from "./scene/scene_manager"
import {timestamp} from "./misc/time"
import { ClickEvent } from "./misc/event";
import HelloWorldScene from "./game/hello_world_scene";
import Scene1 from "./game/scene1";
import SimpleScene from "./scene/simple_scene";
import Dialogue from "./data/dialogue";

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
    this.ctx.textBaseline = "top";
    this.last = timestamp();

    this.sceneManager = new SceneManager(this.ctx);
    let welcomeScene = new WelcomeScene(this.sceneManager, canvas);
    this.sceneManager.push("welcome", welcomeScene);

    let helloWorldScene = new HelloWorldScene(canvas);
    this.sceneManager.push("helloWorld", helloWorldScene);

    let scene1 = new Scene1(canvas);
    this.sceneManager.push("scene1", scene1);

    let simpleScene = new SimpleScene(canvas,
        "Scene 01", "夕阳无限好，狼虎伺机动");
    this.sceneManager.push("simple", simpleScene);
    let dialogue = new Dialogue("郑小则",
      "人生不如意事，十有八九，唯有一二，让你慰藉，希望你能开心");
    simpleScene.addDialogue(dialogue);

    this.sceneManager.switchScene("simple");
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