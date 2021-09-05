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
          new Text("大都真大啊，人也有很多")
        ))
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("呵呵，过段时间你就会习惯的"),
          false
        ))
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("我给你介绍这上面的住所以及有什么人"),
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
          new Text("这个是太子丹的住所，你可以在里面找到\f太子丹\r\f樊于期\r其他门客还有我")
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
          new Text("而下面是集市，我的好朋友\f高渐离\r，\f狗屠\r也在那里，你有什么要买的，都可以去这买，应该都能买到")
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
          new Text("右边栏目是这个地方的人物，长按可以看这个人的描述，点击可以与之互动，待会可以试一下"),
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
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("注意到太子府右上角有个惊叹号，某些人物头像也可能有惊叹号，这表示点击则会触发剧情"),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("我们一起去太子府把"),
          false
        ));
        that.setOnDialogueFinish(() => {
          sequence.next();
        })
      }
    })
    return sequence;
  }
}