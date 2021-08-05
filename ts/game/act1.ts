import { AnimatorSetBuilder } from "../animator/animator_set";
import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect"
import Timeout from "../animator/timeout";
import Dialogue from "../data/dialogue";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import SimpleScene from "../scene/simple_scene"
import ImageView, { PointerPosition } from "../widgets/imageview";
import TextView from "../widgets/textview";
import {Option, OptionCallback} from "../widgets/option_view"
import { Sequence } from "../schedule/sequence";
import Main from "../main";
import { Event, Player } from "../data/player";
import BirdViewImage from "../widgets/birdview_image";
import LinearLayout from "../widgets/linear_layout";

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
          enum OPT {
            BEAR = 0,
            DEER = 1,
            CHICKEN = 2,
          }
          let callback:OptionCallback = {
            onOptionClicked(opt: Option): boolean {
              switch(opt.id) {
                case OPT.BEAR:
                  console.log("You have learned how to cook bear");
                  break;
                case OPT.DEER:
                  console.log("You have learned how to cook deer");
                  break;
                case OPT.CHICKEN:
                  console.log("You have learned how to cook chicken");
                  break;
              }
              Main.getPlayer().saveChoose(Event.FRE_WHAT_LEARN, opt.id);
              sequence.next();
              return true;
            }
          }
          let opt1 = new Option(OPT.BEAR, "蒸熊掌", callback);
          let opt2 = new Option(OPT.DEER, "蒸鹿尾", callback);
          let opt3 = new Option(OPT.CHICKEN, "烧花鸡", callback);
          options.push(opt1, opt2, opt3);
        }
        that.showOptionView("我学了", options);
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let word = "不错不错。";
        let opt = Main.getPlayer().getChoose(Event.FRE_WHAT_LEARN);
        switch(opt) {
          case 0:
            word += "熊掌可好吃了";
            break;
          case 1:
            word += "鹿尾大补啊";
            break;
          case 2:
            word += "大吉大利，今晚吃鸡";
            break;
          case Player.CHOOSE_NOT_FOUND:
            sequence.next();
            return;
        }
        that.addDialogue(new Dialogue(
          "荆轲",
          word,
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          "快随我入城把",
          false
        ));
        that.setOnDialogueFinish(() => {
          sequence.next();
        });
      }
    });
    sequence.addIntoSequence({
      onStart() {
        that.hideDialogue();
        that.setupMainPanel();
      }
    });
    sequence.startOne();
  }

  setupMainPanel() {
    let cityPhoto = new BirdViewImage("res/city_of_yan.png");
    cityPhoto.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    cityPhoto.forceHeight = this.canvasHeight * 2 / 3;
    cityPhoto.layoutParam.xcfg = Align.CENTER;
    cityPhoto.layoutParam.ycfg = Align.CENTER;
    this.addView(cityPhoto);
    let placeRegion = new LinearLayout();
    placeRegion.forceWidth = 100;
    placeRegion.layoutParam.xcfg = Align.END;
    placeRegion.margin.right = 10;
    placeRegion.margin.top = 40 + this.canvasHeight / 6;
    this.addView(placeRegion);

    let palace = new ImageView("res/copyleft/place_yan_palace.png");
    palace.forceWidth = 100;
    palace.forceHeight = 100;
    placeRegion.addView(palace);
    let market = new ImageView("res/copyleft/place_market.png");
    market.forceWidth = 100;
    market.forceHeight = 100;
    market.margin.top = 10;
    placeRegion.addView(market);

    placeRegion.visible = false;
    this.forceRepaint();

    let that = this;
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        let timeout = new Timeout(1000);
        let timeout2 = new Timeout(1000);
        let scanAnimate1 = new NumberLinearAnimator(
          0, 100, 2000
        );
        scanAnimate1.onValChange = (val) => {
          cityPhoto.sx = val;
        }
        let scanAnimate2 = scanAnimate1.reverse();
        scanAnimate2.onValChange = scanAnimate1.onValChange;
        let scanAnimation = new AnimatorSetBuilder()
          .after(timeout)
          .after(scanAnimate1)
          .after(timeout2)
          .after(scanAnimate2)
          .build();
        scanAnimation.onStop = () => {
          sequence.next();
        }
        that.addAnimator(scanAnimation);
      }
    });
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆棘",
          "噫嘘唏，人真多啊。"
        ))
        that.addDialogue(new Dialogue(
          "荆轲",
          "多乎哉，不多也",
          false
        ))
        that.setOnDialogueFinish(() => {
          sequence.next();
        })
      }
    })
    sequence.addIntoSequence({
      onStart() {
        placeRegion.visible = true;
        palace.pointerPosition = PointerPosition.LEFT;
        that.addDialogue(new Dialogue(
          "荆轲",
          "这上面分别是太子丹的住所，你可以在里面找到 太子丹 樊于期 秦舞阳 燕姬 还有我",
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          "而下面是集市，我的好朋友高渐离，狗屠也在那里",
          false
        ));
        that.setOnDialogueFinish(() => {
          that.showSimpleOptions();
          sequence.next();
        })
      }
    })
    sequence.startOne();
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
    let opt1 = new Option(1, "要有很多很多的钱", optionCallback);
    let opt2 = new Option(2, "成为一名科学家", optionCallback);
    let opt3 = new Option(3, "写出令自己满意的作品，最好能流传", optionCallback);
    options.push(opt1);
    options.push(opt2);
    options.push(opt3);

    this.showOptionView("你有什么理想吗？", options);
  }
}