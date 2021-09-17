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
import Act1TaizifuGreeting from "./data/sequences/act1/act1_taizifu_greeting";
import Act1BuyYanWine from "./data/sequences/act1/act1_buy_yan_wine_from_bm";
import Act1BuyYanWineFromBm from "./data/sequences/act1/act1_buy_yan_wine_from_bm";
import Act1BuyYanWineFanwujiFirstFlow from "./data/sequences/act1/act1_buy_yan_wine_fanwuji_first_flow";
import { Sequence } from "../schedule/sequence";
import { Player } from "../data/player";

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
          that.onEnterCity();
          GameState.instance.recordState("enter_city");
          DBManager.getInstance().save();
        }
      })
      sequence.startOne();
    } else {
      placeAndPeopleView.updatePlace(YanCity.city);
      me.visible = true;
      that.onEnterCity();
    }
  }

  onEnterCity() {
    let that = this;
    if (!GameState.instance.hasEnterState("enter_taizi_house")) {
      YanCity.palace.showNoteSign = true;
      YanCity.palace.dirty = true;
      YanCity.palace.onclickListener = () => {
        let sequence = Act1TaizifuGreeting.get(that);
        sequence.addIntoSequence({
          onStart() {
            YanCity.palace.showNoteSign = false;
            GameState.instance.recordState("enter_taizi_house");
            DBManager.getInstance().save();
            YanCity.palace.onclickListener = ()=>{}
            that.wineBussinessmanFlow();
          }
        })
        sequence.startOne();
      }
    } else {
      this.wineBussinessmanFlow();
    }
  }

  wineBussinessmanFlow() {
    let that = this;
    if (!GameState.instance.hasEnterState("yan_wine_bussinessman")) {
      YanCity.market.showNoteSign = true;
      YanCity.market.dirty = true;
      YanCity.market.onclickListener = () => {
        let sequence = Act1BuyYanWineFromBm.get(that);
        sequence.addIntoSequence({
          onStart() {
            that.hideDialogue();
            YanCity.market.showNoteSign = false;
            GameState.instance.recordState("yan_wine_bussinessman");
            DBManager.getInstance().save();
            YanCity.market.onclickListener = ()=>{}
            that.wineFanwujiFirstMeetFlow();
          }
        })
        sequence.startOne();
      }
    } else {
      that.wineFanwujiFirstMeetFlow();
    }
  }

  wineFanwujiFirstMeetFlow() {
    let that = this;
    if (!GameState.instance.hasEnterState("yan_wine_fanwuji_first")) {
      Actors.instance.fanwuji.showNoteSign = true;
      Actors.instance.fanwuji.onclickListener = () => {
        let sequence = Act1BuyYanWineFanwujiFirstFlow.get(that);
        sequence.addIntoSequence({
          onStart() {
            GameState.instance.recordState("yan_wine_fanwuji_first");
            DBManager.getInstance().save();
            Actors.instance.fanwuji.onclickListener = () => {}
            that.wineFanwujiBattleFlow();
          }
        })
        sequence.startOne();
      }
    } else {
      that.wineFanwujiBattleFlow();
    }
  }

  wineFanwujiBattleFlow() {
    let scene = this;
    if (!GameState.instance.hasEnterState("yan_wine_fanwuji_battle")) {
      Actors.instance.fanwuji.showNoteSign = true;
      Actors.instance.fanwuji.onclickListener = () => {
        let sequence = new Sequence();
        sequence.addIntoSequence({
          onStart() {
            scene.addDialogue(new Dialogue(
              Actors.instance.fanwuji.character,
              new Text("你准备好了吗？")
            ))
            scene.setOnDialogueFinish(() => {
              sequence.next();
            })
          }
        })
        sequence.addIntoSequence({
          onStart() {
            scene.showBattlePanel(
              Player.instance.character,
              Actors.instance.fanwuji.character,
              /** onWin */
              () => {
                scene.addDialogue(new Dialogue(
                  Actors.instance.fanwuji.character,
                  new Text("恭喜你，这壶酒你拿去把"),
                  false
                ))
                scene.addDialogue(new Dialogue(
                  Player.instance.character,
                  new Text("多谢先生"),
                ))
                scene.setOnDialogueFinish(() => {
                  scene.hideDialogue();
                  Actors.instance.fanwuji.showNoteSign = false;
                  Actors.instance.fanwuji.dirty = true;
                  Actors.instance.fanwuji.onclickListener = () => {}
                  sequence.next();
                })
              },
              /** onFail */
              () => {
                scene.addDialogue(new Dialogue(
                  Actors.instance.fanwuji.character,
                  new Text("看来你还得努力啊"),
                  false
                ))
                scene.setOnDialogueFinish(() => {
                  scene.hideDialogue();
                  sequence.next();
                })
              }
            )
          }
        })
        sequence.startOne();
      }
    }
  }
}