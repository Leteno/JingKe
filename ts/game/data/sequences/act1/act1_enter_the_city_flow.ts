import { AnimatorSetBuilder } from "../../../../animator/animator_set";
import NumberLinearAnimator from "../../../../animator/number-linear-animator";
import Timeout from "../../../../animator/timeout";
import { GoodsPanelModel } from "../../../../compose/goods_panel";
import { Place, PlaceAndPeopleView } from "../../../../compose/place_and_people_view";
import Dialogue from "../../../../data/dialogue";
import { Prossession } from "../../../../data/prossession";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import BirdViewImage from "../../../../widgets/birdview_image";
import ImageView, { PointerPosition } from "../../../../widgets/imageview";
import { BgText } from "../../../../widgets/richtext";
import {Text} from "../../../../widgets/textview";
import { Actors } from "../../actors";

export default class Act1EnterTheCityFlow {
  static get(that: SimpleScene, cityPhoto: BirdViewImage,
    placeAndPeopleView: PlaceAndPeopleView, me: ImageView) {
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
          sequence.next();
        })
      }
    })
    return sequence;
  }
}