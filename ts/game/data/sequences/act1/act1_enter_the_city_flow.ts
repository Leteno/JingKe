import { AnimatorSetBuilder } from "../../../../animator/animator_set";
import NumberLinearAnimator from "../../../../animator/number-linear-animator";
import Timeout from "../../../../animator/timeout";
import { PlaceAndPeopleView } from "../../../../compose/place_and_people_view";
import Dialogue from "../../../../data/dialogue";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import BirdViewImage from "../../../../widgets/birdview_image";
import ImageView, { PointerPosition } from "../../../../widgets/imageview";
import { BgText } from "../../../../widgets/richtext";
import {Text} from "../../../../widgets/textview";
import { Actors } from "../../actors";
import YanCity from "../../places/yan_city";

export default class Act1EnterTheCityFlow {
  static get(that: SimpleScene, cityPhoto: BirdViewImage,
    placeAndPeopleView: PlaceAndPeopleView, me: ImageView) {
    let sequence = new Sequence();
    let city = YanCity.city;
    let market = YanCity.market;
    let palace = YanCity.palace;
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
    sequence.addIntoSequence({
      onStart() {
        palace.pointerPosition = PointerPosition.LEFT;
        placeAndPeopleView.updatePlace(city);
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