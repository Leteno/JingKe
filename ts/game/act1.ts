import { AnimatorSetBuilder } from "../animator/animator_set";
import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect"
import Timeout from "../animator/timeout";
import Dialogue from "../data/dialogue";
import { Align} from "../misc/layout";
import SimpleScene from "../scene/simple_scene"
import { PointerPosition } from "../widgets/imageview";
import TextView, { Text } from "../widgets/textview";
import {Option} from "../widgets/option_view"
import { Sequence } from "../schedule/sequence";
import { BgText } from "../widgets/richtext";
import { Place } from "../compose/place_and_people_view";
import { Act1Flows } from "./data/act1_flows";
import { GoodsPanelModel } from "../compose/goods_panel";
import { Prossession } from "../data/prossession";
import { Actors } from "./data/actors";
import { CaptionTitleFadeInFadeOut } from "../animator/flow/caption_title_fadein_fadeout";
import { GameState } from "./game_state";
import DBManager from "../storage/db_manager";
import { SimpleSceneViews } from "./data/views/simple_scene_views";
import { Act1Views } from "./data/views/act1_views";
import Act1MeetQuizFlow from "./data/sequences/act1/act1_meet_quiz_flow";

export default class Act1 extends SimpleScene {

  onStart(ctx) {
    super.onStart(ctx);
    SimpleSceneViews.init();

    if (!GameState.instance.hasEnterState("act1_opening")) {
      let sceneCaption = SimpleSceneViews.sceneCaption;
      let sceneTitle = SimpleSceneViews.sceneTitle;
      sceneCaption.setText(new Text("Act 01"));
      sceneTitle.setText(new Text("北风起, 黄花满地"));
      this.addView(sceneCaption);
      this.addView(sceneTitle);
      this.forceRepaint();
      let animation = CaptionTitleFadeInFadeOut.getAnimator(
        sceneCaption, sceneTitle
      );
      animation.onStop = () => {
        GameState.instance.recordState("act1_opening");
        DBManager.getInstance().save();
        this.onPageReady();
      }
      this.addAnimator(animation);
    } else {
      this.onPageReady();
    }
  }

  onPageReady() {
    let desc = new TextView();
    desc.setText(new Text("战国末年，秦国吞并韩赵，势逼燕国。在此之际，燕太子丹记挂着质于秦的私仇。" +
      "你正投奔在太子做门客的舅舅，荆轲"));
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
    let firstMeetSequence = Act1MeetQuizFlow.get(this);
    firstMeetSequence.addIntoSequence({
      onStart() {
        that.setupMainPanel();
      }
    });
    firstMeetSequence.startOne();
  }

  setupMainPanel() {
    Act1Views.init(this.canvasWidth, this.canvasHeight);
    let cityPhoto = Act1Views.cityPhoto;
    let placeAndPeopleView = Act1Views.placeAndPeopleView;
    let me = Act1Views.me;

    placeAndPeopleView.showDescription = this.showCharacterDescription.bind(this);
    me.onclickInternal = (event) => {
      this.showUserPanel();
      return true;
    }
    me.visible = false;
    this.addView(cityPhoto);
    this.addView(me);
    this.addView(placeAndPeopleView);
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
          new Text("噫嘘唏，人真多啊。")
        ))
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("多乎哉，不多也"),
          false
        ))
        that.setOnDialogueFinish(() => {
          sequence.next();
        })
      }
    })
    let mainPlace = new Place();
    let palace = new Place();
    let market = new Place();
    palace.imageSrc = "res/copyleft/place_yan_palace.png";
    market.imageSrc = "res/copyleft/place_market.png";
    palace.onpressListener = () => {
      console.log("This is the palace of Prince Dan");
    }
    market.onpressListener = () => {
      console.log("This is the place for poors");
    }
    palace.peoples.push(Actors.getInstance().fanwuji);
    mainPlace.peoples.push(Actors.getInstance().juzi);
    let juziFlow = Act1Flows.getInstance().greetingFromJuzi;
    juziFlow.bind(this);
    Actors.getInstance().juzi.onclickListener = () => {
      juziFlow.reset();
      juziFlow.startFlow();
    }
    market.peoples.push(Actors.getInstance().businessman);
    mainPlace.places.push(palace, market);
    Actors.getInstance().businessman.onclickListener = () => {
      let model = new GoodsPanelModel();
      let p1 = new Prossession();
      p1.name = "六味补气丸";
      p1.cost = 10;
      p1.count = 10;
      p1.functional_text = "益气活血，祛痰化瘀";
      p1.image = "res/created/medition.png";
      let p2 = new Prossession();
      p2.name = "秦国军旗";
      p2.cost = 100;
      p2.count = 1;
      p2.functional_text = "赳赳大秦，一往无前";
      p2.image = "res/created/flag_of_qin.png";
      model.goodsList.push(p1, p2);
      that.showGoodsPanel(model);
    }
    sequence.addIntoSequence({
      onStart() {
        palace.pointerPosition = PointerPosition.LEFT;
        placeAndPeopleView.updatePlace(mainPlace);
        me.visible = true;
        let peopleEffect = new BgText("green", "white");
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("这上面分别是太子丹的住所，你可以在里面找到\f太子丹\r\f樊于期\r\f秦舞阳\r\f燕姬\r还有我")
           .setDefaultEffect(peopleEffect),
          false
        ));
        that.setOnDialogueFinish(() => {
          palace.pointerPosition = PointerPosition.NONE;
          palace.dirty = true;
          sequence.next();
        });
      }
    })
    sequence.addIntoSequence({
      onStart() {
        market.pointerPosition = PointerPosition.LEFT;
        market.dirty = true;
        let peopleEffect = new BgText("green", "white");
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("而下面是集市，我的好朋友\f高渐离\r，\f狗屠\r也在那里")
            .setDefaultEffect(peopleEffect),
          false
        ));
        that.setOnDialogueFinish(() => {
          market.pointerPosition = PointerPosition.NONE;
          market.dirty = true;
          sequence.next();
        })
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let juzi = Actors.getInstance().juzi;
        juzi.pointerPosition = PointerPosition.RIGHT;
        juzi.dirty = true;
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("右边的人物，长按可以看这个人的描述，点击可以与之互动"),
          false
        ));

        that.setOnDialogueFinish(() => {
          juzi.pointerPosition = PointerPosition.NONE;
          juzi.dirty = true;
          palace.showNoteSign = true;
          palace.dirty = true;
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
      onOptionClicked(op: number):boolean {
        that.addDialogue(new Dialogue("另一个我", new Text("这些都是可以的，关键在行动，关键在坚持")));
        that.setOnDialogueFinish(() => {
          that.hideDialogue();
        })
        return true;
      }
    }
    let opt1 = new Option(1, new Text("要有很多很多的钱"));
    let opt2 = new Option(2, new Text("成为一名科学家"));
    let opt3 = new Option(3, new Text("写出令自己满意的作品，最好能流传"));
    options.push(opt1);
    options.push(opt2);
    options.push(opt3);

    this.showOptionView(new Text("你有什么理想吗？"), options, optionCallback);
  }
}