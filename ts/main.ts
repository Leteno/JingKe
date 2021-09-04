import Act1 from "./game/act1";
import WelcomeScene from "./game/welcome-scene";
import Scene from "./scene/scene";
import SceneManager from "./scene/scene_manager"
import {timestamp} from "./misc/time"
import { ClickEvent, PressEvent } from "./misc/event";
import HelloWorldScene from "./game/hello_world_scene";
import Scene1 from "./game/scene1";
import SimpleScene from "./scene/simple_scene";
import Dialogue from "./data/dialogue";
import { Player } from "./data/player";
import EventHandler from "./misc/event_handler";
import { Actors } from "./game/data/actors";
import DBManager from "./storage/db_manager";
import { DBInteface } from "./storage/db_interface";
import { GameState } from "./game/game_state";
import TextEffects from "./game/data/styles/text_effects";

export default class Main {
  aniId: number;
  bindLoop: any;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  eventHandler: EventHandler;

  last: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // id of requestAnimationFrame
    this.aniId = 0;
    this.bindLoop = this.gameLoop.bind(this);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.textBaseline = "top";
    this.last = timestamp();

    SceneManager.init(this.ctx);
    TextEffects.init();

    let welcomeScene = new WelcomeScene(canvas);
    SceneManager.getInstance().push("welcome", welcomeScene);

    let helloWorldScene = new HelloWorldScene(canvas);
    SceneManager.getInstance().push("helloworld", helloWorldScene);

    let scene1 = new Scene1(canvas);
    SceneManager.getInstance().push("scene1", scene1);

    let act1 = new Act1(canvas);
    SceneManager.getInstance().push("act1", act1);

    SceneManager.getInstance().switchScene("welcome");
    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop
    );

    this.eventHandler = new EventHandler();
    this.eventHandler.bind(canvas);
    this.eventHandler.bindOnClickHandler((event: ClickEvent) => {
      return SceneManager.getInstance().currentScene.onclick(event);
    }
    );
    this.eventHandler.bindOnPressHandler((event: PressEvent) => {
      return SceneManager.getInstance().currentScene.onpress(event);
    });

    DBManager.getInstance().setReload((db: DBInteface) => {
      let p = db.getData("game_state");
      if (p.getLength() > 0) {
        // TODO support compatibility on proto upgrade.
        GameState.instance.fromParcel(p);
      }
    });
    DBManager.getInstance().setSave((db: DBInteface) => {
      db.saveData("game_state", GameState.instance.toParcel());
    });
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
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.restore();
  }
}