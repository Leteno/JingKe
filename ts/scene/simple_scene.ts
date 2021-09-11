import Animator from "../animator/animator";
import GoodsPanel, { GoodsPanelModel } from "../compose/goods_panel";
import MessageBox from "../compose/message_box";
import PlayerDescriptionView from "../compose/player_description_view";
import UserPanel from "../compose/UserPanel";
import { Character } from "../data/character";
import Dialogue from "../data/dialogue";
import { Player } from "../data/player";
import { ClickEvent, PressEvent } from "../misc/event";
import { Align, LayoutParams, LayoutType, Specify } from "../misc/layout";
import DialogueView from "../widgets/dialogue_view";
import OptionView, { Option, OptionCallback } from "../widgets/option_view";
import Panel from "../widgets/panel";
import SimpleView from "../widgets/simple_view";
import Sprite from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";
import Scene from "./scene";

export default abstract class SimpleScene implements Scene {
  private mainPanel: Panel;
  private dialogueView: DialogueView;
  private optionView: OptionView;
  private descriptionView: PlayerDescriptionView;
  private userPanel: UserPanel;
  private goodsPanel: GoodsPanel;
  private messageBox: MessageBox;

  canvasWidth: number;
  canvasHeight: number;

  private animators: Array<Animator<number>>;

  private components: Array<SimpleView>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.mainPanel = new Panel();

    // Put optionView in the beginning,
    // to capture click event first.
    this.optionView = new OptionView(canvas);

    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.mainPanel.padding.left = 20;
    this.mainPanel.padding.right = 20;
    this.mainPanel.padding.bottom = 20;

    this.animators = new Array<Animator<number>>();

    this.dialogueView = new DialogueView();
    this.dialogueView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.dialogueView.margin.left = 20;
    this.dialogueView.margin.right = 20;
    this.dialogueView.margin.bottom = 20;
    this.dialogueView.layoutParam.xcfg = Align.CENTER;
    this.dialogueView.layoutParam.ycfg = Align.END;
    this.dialogueView.bgColor = "#FFF99D";

    this.descriptionView = new PlayerDescriptionView();
    this.descriptionView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.descriptionView.layoutParam.xcfg = Align.CENTER;
    this.descriptionView.layoutParam.ycfg = Align.CENTER;
    this.descriptionView.margin.left = 40;
    this.descriptionView.margin.right = 40;
    this.descriptionView.visible = false;

    this.userPanel = new UserPanel();
    this.userPanel.forceHeight = canvas.height / 3;
    this.userPanel.visible = false;

    this.goodsPanel = new GoodsPanel();
    this.goodsPanel.forceHeight = canvas.height / 3;
    this.goodsPanel.visible = false;

    this.messageBox = new MessageBox();
    this.messageBox.visible = false;

    this.components = [
      this.mainPanel,
      this.dialogueView,
      this.descriptionView,
      this.userPanel,
      this.goodsPanel,
      this.optionView,
      this.messageBox
    ];
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.components.forEach(component => {
      component.measure(ctx, this.canvasWidth, this.canvasHeight, Specify.NONE);
      component.layout(this.canvasWidth, this.canvasHeight);
    });
  }

  update(dt: number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    });
    this.optionView.update(dt);
    this.dialogueView.updateTime(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.components.forEach(component => {
      component.drawToCanvas(ctx);
    });
  }

  onclick(event: ClickEvent) {
    for (let i = this.components.length - 1; i >= 0; i--) {
      if (this.components[i].onclick(event)) {
        return;
      }
    }
  }

  onpress(event: PressEvent) {
    for (let i = this.components.length - 1; i >= 0; i--) {
      if (this.components[i].onpress(event)) {
        return;
      }
    }
  }

  addDialogue(data: Dialogue) {
    this.dialogueView.addDialogue(data);
  }

  hideDialogue() {
    this.dialogueView.hide();
  }

  showOptionView(
    title: Text, options: Array<Option>,
    callback: OptionCallback,
    timing?: number) {
    if (timing == undefined) {
      this.optionView.show(
        title, options, callback
      );
    } else {
      this.optionView.show(
        title, options, callback, timing
      );
    }
  }

  addAnimator(animator: Animator<number>) {
    this.animators.push(animator);
  }

  addView(view: Sprite) {
    this.mainPanel.addView(view);
  }

  forceRepaint() {
    this.mainPanel.setIsDirty(true);
  }

  setOnDialogueFinish (fn: ()=>void) {
    this.dialogueView.onDialogueFinished = fn;
  }

  showCharacterDescription(player: Character) {
    this.descriptionView.setCharacter(player);
    this.descriptionView.visible = true;
  }

  showUserPanel() {
    this.userPanel.updateCharacter(Player.getInstance().character);
    this.userPanel.visible = true;
  }

  showGoodsPanel(model: GoodsPanelModel) {
    this.goodsPanel.bindModel(model);
    this.goodsPanel.visible = true;
  }

  showMessageBox(title: Text, content: Text, fn?: ()=>void) {
    this.messageBox.show(title, content);
    if (fn) {
      this.messageBox.onMessageBoxDismiss = fn;
    }
  }
}