import { ClickEvent, DragEvent, PressEvent } from "../misc/event";
import { Align, LayoutParams, LayoutType, Specify } from "../misc/layout";
import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene";
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView, { DrawFunc, Text } from "../widgets/textview";
import DialogueView from "../widgets/dialogue_view";
import Dialogue from "../data/dialogue";
import OptionView, {Option, OptionCallback} from "../widgets/option_view";
import { BgText } from "../widgets/richtext";
import BirdViewImage from "../widgets/birdview_image";
import { AnimatorSetBuilder } from "../animator/animator_set";
import { ScrollView } from "../widgets/scrollview";
import { Character } from "../data/character";

export default class HelloWorldScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  dialogueView: DialogueView;
  optionView: OptionView;

  canvasWidth: number;
  canvasHeight: number;

  me: Character;
  her: Character;

  constructor(canvas: HTMLCanvasElement) {

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.mainPanel = new Panel();
    this.mainPanel.forceWidth = canvas.width;
    this.mainPanel.forceHeight = canvas.height;
    this.mainPanel.padding.left = 20;
    this.mainPanel.padding.right = 20;
    this.mainPanel.padding.bottom = 20;

    this.animators = new Array<Animator<number>>();

    let birdview = new BirdViewImage("res/city_of_yan.png");
    birdview.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    birdview.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    this.mainPanel.addView(birdview);

    let scanningImage1 = new NumberLinearAnimator(
      0, 200,
      4000
    );
    let scanningImage2 = new NumberLinearAnimator(
      0, 100,
      4000
    );
    scanningImage1.onValChange = (val) => {
      birdview.sx = val;
    }
    scanningImage2.onValChange = (val) => {
      birdview.sy = val;
    }
    let scanningImage3 = scanningImage1.reverse();
    let scanningImage4 = scanningImage2.reverse();
    scanningImage3.onValChange = scanningImage1.onValChange;
    scanningImage4.onValChange = scanningImage2.onValChange;
    let scanningImage = new AnimatorSetBuilder()
      .after(scanningImage1)
      .after(scanningImage2)
      .after(scanningImage3)
      .after(scanningImage4)
      .build();
    this.animators.push(scanningImage);

    let scrollView = new ScrollView();
    scrollView.forceHeight = 200;
    this.mainPanel.addView(scrollView);
    let text = new TextView(new Text("???????????????(?????????)"));
    text.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    scrollView.addView(text);
    text.bgColor = "#cccccc";

    let text2 = new TextView(new Text("???????????????(??????)"));
    text2.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text2.margin.top = 40;
    scrollView.addView(text2);
    text2.bgColor = "#eeeeee";

    let text3 = new TextView(
      new Text("??????????????????\f????????????\r \f+1\r???")
        .updatePatternDrawFunc("????????????", new BgText("green", "white", Align.END))
        .updatePatternDrawFunc("+1", new BgText(undefined, "white", Align.START))
    );
    text3.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text3.margin.top = -100;
    scrollView.addView(text3);
    text3.bgColor = "#bbbbbb";

    let imageView = new ImageView("res/artichoke_PNG30.png");
    imageView.margin.left = canvas.width / 3;
    imageView.forceWidth = imageView.forceHeight = 100;
    this.mainPanel.addView(imageView);

    let animatorImageViewY = new NumberLinearAnimator(
      0, canvas.height * 2, 20000
    )
    animatorImageViewY.onValChange = function(val: number) {
      imageView.y = animatorImageViewY.getVal();
    }
    this.animators.push(animatorImageViewY)

    let longText = new TextView(new Text("?????????????????????????????????????????????????????????????????????????????????,thank you very much."));
    longText.layoutParam = new LayoutParams(Align.START, Align.CENTER)
    longText.margin.top = 100;
    longText.debug = true;
    longText.padding.top = longText.padding.bottom =
      longText.padding.left = longText.padding.right = 16;
    scrollView.addView(longText);

    let up = new TextView(new Text("Up"));
    let down = new TextView(new Text("Down"));
    up.onclickInternal = (event) => {
      scrollView.scrollBy(0, -10);
      return true;
    }
    up.onpressInternal = up.onclickInternal;
    down.onclickInternal = (event) => {
      scrollView.scrollBy(0, 10);
      return true;
    }
    down.onpressInternal = down.onclickInternal;
    up.layoutParam.xcfg = Align.START;
    up.layoutParam.ycfg = Align.CENTER;
    down.layoutParam.xcfg = Align.END;
    down.layoutParam.ycfg = Align.CENTER;
    this.mainPanel.addView(up);
    this.mainPanel.addView(down);

    this.dialogueView = new DialogueView();
    this.dialogueView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.mainPanel.addView(this.dialogueView);
    this.dialogueView.bgColor = "#FFF99D";
    let me = new Character();
    me.name = "?????????";
    me.imageSrc = "res/copyleft/people_fanwuji.png";
    this.me = me;
    let her = new Character();
    her.name = "?????????";
    this.dialogueView.addDialogue(new Dialogue(
      me,
      new Text("??????????????????????????????????????????????????????Ok, Fine. ????????????????????????????????????????????????????????????????????????????????????")
      )
    );
    this.dialogueView.addDialogue(new Dialogue(
      me,
      new Text("???????????????")
      )
    );
    this.dialogueView.onDialogueFinished = (() => {
      this.showSimpleOptions();
    }).bind(this);

    this.optionView = new OptionView(canvas);
    this.mainPanel.addView(this.optionView);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, Specify.X | Specify.Y);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
  }

  showSimpleOptions() {
    let that = this;
    let options = new Array<Option>();
    enum OPT {
      DENY = 0,
      ACCEPT = 1,
      FIGHT = 2
    }
    let optDeny = new Option(
      OPT.DENY,
      new Text("?????? ????????????????????? \f??????\r\f+1\r")
        .updatePatternDrawFunc("??????", new BgText("green", "white"))
        .updatePatternDrawFunc("+1", new BgText(undefined, "white"))
    );
    let optAccept = new Option(
      OPT.ACCEPT,
      new Text("?????? ????????????????????? \f??????\r\f+500\r")
        .updatePatternDrawFunc("??????", new BgText("yellow", "black"))
        .updatePatternDrawFunc("+500", new BgText(undefined, "white")),
    );
    let optFight = new Option(
      OPT.FIGHT,
      new Text("??????????????????????????????. \f??????\r\f+1\r \f??????\r\f+1\r")
        .updatePatternDrawFunc("??????", new BgText("green", "white"))
        .updatePatternDrawFunc("??????", new BgText("black", "white"))
        .updatePatternDrawFunc("+1", new BgText(undefined, "white"))
    );
    options.push(optDeny, optAccept, optFight);
    let callback: OptionCallback = {
      onOptionClicked(option:number) {
        switch(option) {
          case OPT.ACCEPT:
            that.dialogueView.addDialogue(
              new Dialogue(that.me, new Text("???????????????????????????")));
            that.dialogueView.addDialogue(
              new Dialogue(that.her, new Text("???????????????"), false /* showAtLeft */)
            );
            break;
          case OPT.DENY:
            that.dialogueView.addDialogue(
              new Dialogue(that.me, new Text("????????????????????????")));
            that.dialogueView.addDialogue(
              new Dialogue(that.her, new Text("???????????????"), false /* showAtLeft */)
            );
            break;
          case OPT.FIGHT:
            that.dialogueView.addDialogue(
              new Dialogue(that.me, new Text("????????????????????????????????????????????????")));
            that.dialogueView.addDialogue(
              new Dialogue(that.her, new Text("????????????"), false /* showAtLeft */)
            );
            break;
        }
        that.dialogueView.onDialogueFinished = () => {
          that.dialogueView.visible = false;
        }
        return true;
      }
    };
    let title = "??????????????????";
    this.optionView.show(new Text(title), options, callback);
  }

  update(dt: number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    });
    this.dialogueView.updateTime(dt);
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