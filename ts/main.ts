import Act1 from "./game/act1";
import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import SceneManager from "./scene/scene_manager"
import {timestamp} from "./misc/time"
import { ClickEvent } from "./misc/event";
import HelloWorldScene from "./game/hello_world_scene";
import Scene1 from "./game/scene1";
import SimpleScene from "./scene/simple_scene";
import Dialogue from "./data/dialogue";
import { Player } from "./data/player";

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  last: number;

  static player: Player;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.textBaseline = "top";
    this.last = timestamp();

    SceneManager.init(this.ctx);
    let welcomeScene = new WelcomeScene(SceneManager.getInstance(), canvas);
    SceneManager.getInstance().push("welcome", welcomeScene);

    let helloWorldScene = new HelloWorldScene(canvas);
    SceneManager.getInstance().push("helloworld", helloWorldScene);

    let scene1 = new Scene1(canvas);
    SceneManager.getInstance().push("scene1", scene1);

    let act1 = new Act1(canvas);
    SceneManager.getInstance().push("act1", act1);

    SceneManager.getInstance().switchScene("act1");
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
    SceneManager.getInstance().currentScene.update(dt);
  }

  render() {
    this.clearScreen();
    SceneManager.getInstance().currentScene.render(this.ctx);
  }

  clearScreen() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.restore();
  }

  onclick(event: PointerEvent) {
    SceneManager.getInstance().currentScene.onclick(ClickEvent.from(event))
  }

  static getPlayer() : Player {
    if (this.player == null) {
      this.player = new Player();
      // Read from disk.
    }
    return this.player;
  }
}