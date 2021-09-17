import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene"
import {Align, LayoutParams, LayoutType, Specify} from "../misc/layout"
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";
import { ClickEvent, DragEvent, PressEvent } from "../misc/event";
import SceneManager from "../scene/scene_manager";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import { Border } from "../widgets/sprite";
import DBManager from "../storage/db_manager";
import { GameState } from "./game_state";
import { StringUtils } from "../misc/string_utils";
import SimpleView from "../widgets/simple_view";
import Colors from "./data/styles/colors";
import MessageBox from "../compose/message_box";
import { SaveInfo } from "../storage/basic_info";
import { info } from "console";

export default class WelcomeScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  canvasWidth: number;
  canvasHeight: number;
  gameSelectPopup: GameSelectPopup;
  title: TextView;
  options: LinearLayout;

  constructor(canvas: HTMLCanvasElement) {
    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.animators = new Array<Animator<number>>();
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.title = new TextView(new Text("荆轲刺秦王"));
    this.title.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.mainPanel.addView(this.title);
    this.title.textSize = 40;
    this.title.margin.top = -100;

    this.options = new LinearLayout(Orientation.VERTICAL);
    this.options.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.options.layoutParam.xcfg = Align.CENTER;
    this.options.layoutParam.ycfg = Align.CENTER;
    this.options.visible = false;
    this.mainPanel.addView(this.options);
    let startBtn = new TextView(new Text("开始游戏"));
    startBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.options.addView(startBtn);
    startBtn.textSize = 24;
    startBtn.onclickInternal = ((event: ClickEvent) : boolean => {
      this.gameSelectPopup.show();
      return true;
    }).bind(this);

    let configBtn = new TextView(new Text("配置"));
    configBtn.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    this.options.addView(configBtn);
    configBtn.textSize = 24;
    configBtn.margin.top = 60;
    let configPanel = new ConfigPanel();
    configPanel.visible = false;
    this.mainPanel.addView(configPanel);
    configBtn.onclickInternal = (event: ClickEvent) : boolean => {
      configPanel.visible = true;
      return true;
    }

    // game
    this.gameSelectPopup = new GameSelectPopup();
    this.mainPanel.addView(this.gameSelectPopup);
  }

  onStart(ctx: CanvasRenderingContext2D) {

    let that:WelcomeScene = this;
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, Specify.NONE);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);

    let animatorTextViewString = new NumberLinearAnimator(
      0, this.title.text.content.length, 1500
    )
    animatorTextViewString.onValChange = function(val: number) {
      that.title.showTextLength = val;
    };
    animatorTextViewString.onStop = function() {
      setTimeout(() => {
        that.options.visible = true;
      }, 500);
    }
    this.animators.push(animatorTextViewString)
  }

  update(dt: number) {
    this.animators.forEach((animator => {
      animator.update(dt)
    }));
  }

  render(ctx: CanvasRenderingContext2D) {
    this.mainPanel.drawToCanvas(ctx);
  }

  onclick(event: ClickEvent) {
    this.mainPanel.onclick(event);
  }
  onpress(event: PressEvent) {
    this.mainPanel.onpress(event);
  }
  ondrag(event: DragEvent) {
    this.mainPanel.ondrag(event);
  }
}

class GameSelectPopup extends LinearLayout {
  constructor() {
    super();
    this.visible = false;

    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.margin.left = this.margin.right = 40;
    this.layoutParam.xcfg = Align.CENTER;
    this.layoutParam.ycfg = Align.CENTER;
    this.bgColor = "#f6f6f6";
  }

  show() {
    let that = this;
    that.removeAllViews();
    let infos = DBManager.getInstance().getSaveInfos();
    infos.forEach(info => {
      let view = new SaveItemView(info);
      let cacheInfo = info;
      view.onclickInternal = () => {
        that.visible = false;
        console.log("use " + cacheInfo.dbName);
        DBManager.getInstance().use(cacheInfo.dbName);
        if (StringUtils.isEmpty(GameState.instance.currentSceneName)) {
          GameState.instance.currentSceneName = 'act1';
        }
        SceneManager.getInstance().switchScene(
          GameState.instance.currentSceneName
        );
        return true;
      }
      this.addView(view);
    })
    that.setIsDirty(true);
    this.visible = true;
  }
  onTouchOutside(event) {
    if (this.visible) {
      this.visible = false;
      return true;
    }
    return super.onTouchOutside(event);
  }
}

class ConfigPanel extends LinearLayout {
  constructor() {
    super();

    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.margin.left = this.margin.right = 40;
    this.padding.left = this.padding.right =
      this.padding.bottom = this.padding.top = 10;
    this.layoutParam.xcfg = Align.CENTER;
    this.layoutParam.ycfg = Align.CENTER;
    this.bgColor = Colors.winGrey;

    let clearBtn = new TextView(new Text("清除存档:"));
    clearBtn.textColor = Colors.black;
    clearBtn.margin.bottom = 10;
    this.addView(clearBtn);
    for (let i = 1; i <= 3; i++) {
      let text = new TextView();
      text.layoutParam.xLayout = LayoutType.MATCH_PARENT;
      text.textColor = "#171717";
      text.border = new Border();
      text.border.color = "#e5e5e5";
      text.setText(new Text(`Slot ${i}`));
      let dbName = "Slot" + i;
      text.onclickInternal = () => {
        DBManager.getInstance().clearAllSave(dbName);
        console.log("the save is clear");
        return true;
      }
      this.addView(text);
    }
  }
  onTouchOutside(event) {
    if (this.visible) {
      this.visible = false;
      return true;
    }
    return super.onTouchOutside(event);
  }
}

class SaveItemView extends LinearLayout {
  constructor(info: SaveInfo) {
    super(Orientation.VERTICAL);
    this.padding.top = this.padding.bottom
      = this.padding.left = this.padding.right
      = 40;
    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.border = new Border();
    this.border.color = Colors.black;
    let title = new TextView(new Text(info.name));
    let date = new TextView(new Text(info.date));
    title.textColor = Colors.black;
    date.textColor = Colors.black;
    date.layoutParam.xcfg = Align.END;
    this.addView(title);
    this.addView(date);
  }
}