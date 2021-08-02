import { AnimatorSetBuilder } from "../animator/animator_set";
import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect"
import Timeout from "../animator/timeout";
import Dialogue from "../data/dialogue";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import SimpleScene from "../scene/simple_scene"
import ImageView from "../widgets/imageview";
import TextView from "../widgets/textview";
import {Option, OptionCallback} from "../widgets/option_view"
import { Sequence } from "../schedule/sequence";

export default class Act1 extends SimpleScene {

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, "Act 01", "北风起，黄花正娇嫩");
  }

  onPageReady() {
    let desc = new TextView();
    desc.setText("战国末年，秦国吞并韩赵，势逼燕国。在此之际，燕太子丹记挂着质于秦的私仇。" +
      "你正投奔在太子做门客的舅舅，荆轲");
    desc.layoutParam.xcfg = Align.CENTER;
    desc.layoutParam.ycfg = Align.CENTER;
    desc.padding.left = desc.padding.right = 30;
    this.addView(desc);
    this.forceRepaint();

    let that = this;
    desc.setTransparent();
    let showDesc = textAlpha(true, 500, desc);
    let timeout = new Timeout(6500);
    let dismissDesc = textAlpha(false, 500, desc);
    let descAnimationSet = new AnimatorSetBuilder()
      .after(showDesc)
      .after(timeout)
      .after(dismissDesc)
      .build();
    descAnimationSet.onStop = () => {
      that.addFirstMeetDialogues();
    }
    this.addAnimator(descAnimationSet);
  }

  addFirstMeetDialogues() {
    let that = this;
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆棘",
          "舅舅，我来看你了，近来可好?"
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          "我这边还好，那么多年不见，你已经这么高了，这段时间在家学了什么呢？",
          false
        ));
        that.setOnDialogueFinish(sequence.next.bind(sequence));
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let options = new Array<Option>();
        {
          let callback:OptionCallback = {
            onOptionClicked(opt: Option): boolean {
              sequence.next();
              return true;
            }
          }
          let opt1 = new Option("蒸熊掌", callback);
          let opt2 = new Option("蒸鹿尾", callback);
          let opt3 = new Option("烧花鸡", callback);
          options.push(opt1, opt2, opt3);
        }
        that.showOptionView("我学了", options);
      }
    });
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆轲",
          "不错不错。"
        ));
        that.setOnDialogueFinish(() => {
          that.hideDialogue();
          that.setupMainPanel();
        });
      }
    });
    sequence.startOne();
  }

  setupMainPanel() {
    let image = new ImageView("res/artichoke_PNG30.png");
    image.layoutParam.xcfg = Align.CENTER;
    image.layoutParam.ycfg = Align.CENTER;
    this.addView(image);
    this.forceRepaint();
    this.showSimpleOptions();
  }

  showSimpleOptions() {
    let that = this;
    let options = new Array<Option>();
    let optionCallback = {
      onOptionClicked(op: Option):boolean {
        that.addDialogue(new Dialogue("另一个我", "这些都是可以的，关键在行动，关键在坚持"));
        return true;
      }
    }
    let opt1 = new Option("要有很多很多的钱", optionCallback);
    let opt2 = new Option("成为一名科学家", optionCallback);
    let opt3 = new Option("写出令自己满意的作品，最好能流传", optionCallback);
    options.push(opt1);
    options.push(opt2);
    options.push(opt3);

    this.showOptionView("你有什么理想吗？", options);
  }
}