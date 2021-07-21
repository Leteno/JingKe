import { ClickEvent } from "../misc/event";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import Animator from "../animator/animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Scene from "../scene/scene";
import ImageView from "../widgets/imageview";
import Panel from "../widgets/panel";
import TextView, { DrawFunc, TextHelper } from "../widgets/textview";
import DialogueView from "../widgets/dialogue_view";
import Dialogue from "../data/dialogue";
import OptionView, {Option, OptionCallback} from "../widgets/option_view";
import { BgText } from "../widgets/richtext";

export default class HelloWorldScene implements Scene {
  mainPanel: Panel;
  animators: Array<Animator<number>>;
  dialogueView: DialogueView;

  canvasWidth: number;
  canvasHeight: number;

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

    let text = new TextView("你好，过去(不对齐)");
    text.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.mainPanel.addView(text);
    text.bgColor = "#cccccc";

    let text2 = new TextView("你好，过去(对齐)");
    text2.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text2.margin.top = 40;
    this.mainPanel.addView(text2);
    text2.bgColor = "#eeeeee";

    let text3 = new TextView("这句子有四个\f超级能力\r \f+1\r。");
    text3.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
    text3.margin.top = -100;
    this.mainPanel.addView(text3);
    text3.bgColor = "#bbbbbb";

    let bgText = new BgText("green", "white", Align.END);
    text3.updatePatternDrawFunc("超级能力", bgText);
    text3.updatePatternDrawFunc("+1",
      new BgText(undefined, "white", Align.START));

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

    let longText = new TextView("这是一个非常长，非常长的句子。我希望你能够帮忙换一下行,thank you very much.");
    longText.layoutParam = new LayoutParams(Align.START, Align.CENTER)
    longText.margin.top = 100;
    longText.debug = true;
    longText.padding.top = longText.padding.bottom =
      longText.padding.left = longText.padding.right = 16;
    this.mainPanel.addView(longText);

    this.dialogueView = new DialogueView();
    this.dialogueView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.dialogueView.forceHeight = canvas.height / 4;
    this.mainPanel.addView(this.dialogueView);
    this.dialogueView.addDialogue(new Dialogue(
      "郑虾米",
      "这是一段很长的话，但是如果你想看完，Ok, Fine. 我也没有任何意见，只是觉得你或许可以做一点更有意义的事情"
      )
    );
    this.dialogueView.addDialogue(new Dialogue(
      "郑虾米",
      "不要讲干话"
      )
    );

    let optionCallback: OptionCallback = {
      onOptionClicked(option:Option) {
        console.log("option " + option.text + " is clicked");
        return true;
      }
    };

    let options = new Array<Option>();
    let optDeny = new Option("哈哈 我辈岂是蓬蒿人 \f正气\r\f+1\r", optionCallback);
    optDeny.addTextEffect("正气", new BgText("green", "white"));
    optDeny.addTextEffect("+1", new BgText(undefined, "white"));
    options.push(optDeny);
    let optAccept = new Option("哎呀 俯首甘为孺子牛 \f金钱\r\f+500\r", optionCallback);
    optAccept.addTextEffect("金钱", new BgText("yellow", "black"));
    optAccept.addTextEffect("+500", new BgText(undefined, "white"));
    options.push(optAccept);
    let title = "接受贿赂吗？";
    let optionView = new OptionView(canvas, title, options);
    this.mainPanel.addView(optionView);
  }

  onStart(ctx: CanvasRenderingContext2D) {
    this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight);
    this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
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
}