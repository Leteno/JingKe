import { AnimatorSetBuilder } from "../animator/animator_set";
import { textAlpha } from "../animator/text-affect"
import Timeout from "../animator/timeout";
import Dialogue from "../data/dialogue";
import { Align} from "../misc/layout";
import SimpleScene from "../scene/simple_scene"
import TextView, { Text } from "../widgets/textview";
import {Option} from "../widgets/option_view"
import { Act1Flows } from "./data/act1_flows";
import { Actors } from "./data/actors";
import { CaptionTitleFadeInFadeOut } from "../animator/flow/caption_title_fadein_fadeout";
import { GameState } from "./game_state";
import DBManager from "../storage/db_manager";
import { SimpleSceneViews } from "./data/views/simple_scene_views";
import { Act1Views } from "./data/views/act1_views";
import Act1MeetQuizFlow from "./data/sequences/act1/act1_meet_quiz_flow";
import Act1EnterTheCityFlow from "./data/sequences/act1/act1_enter_the_city_flow";
import YanCity from "./data/places/yan_city";

export default class Act1 extends SimpleScene {

  onStart(ctx) {
    super.onStart(ctx);
    SimpleSceneViews.init();
    YanCity.init(this);

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
        this.showDescription();
      }
      this.addAnimator(animation);
    } else {
      this.showFirstMeetDialogues();
    }
  }

  showDescription() {
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
      that.showFirstMeetDialogues();
    }
    this.addAnimator(descAnimationSet);
  }

  showFirstMeetDialogues() {
    if (!GameState.instance.hasEnterState("first_meet_quiz")) {
      let that = this;
      let firstMeetSequence = Act1MeetQuizFlow.get(this);
      firstMeetSequence.addIntoSequence({
        onStart() {
          GameState.instance.recordState("first_meet_quiz");
          that.setupMainPanel();
        }
      });
      firstMeetSequence.startOne();
    } else {
      this.setupMainPanel();
    }
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

    let juziFlow = Act1Flows.getInstance().greetingFromJuzi;
    juziFlow.bind(this);
    Actors.getInstance().juzi.onclickListener = () => {
      juziFlow.reset();
      juziFlow.startFlow();
    }

    let that = this;
    if (!GameState.instance.hasEnterState("enter_city")) {
      let sequence = Act1EnterTheCityFlow.get(
        that, cityPhoto, placeAndPeopleView, me);
      sequence.addIntoSequence({
        onStart() {
          that.showSimpleOptions();
          GameState.instance.recordState("enter_city");
          DBManager.getInstance().save();
        }
      })
      sequence.startOne();
    } else {
      placeAndPeopleView.updatePlace(YanCity.city);
      me.visible = true;
      if (!GameState.instance.hasEnterState("enter_taizi_house")) {
        YanCity.palace.showNoteSign = true;
        YanCity.palace.dirty = true;
      }
      that.showSimpleOptions();
    }
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