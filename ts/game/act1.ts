import { AnimatorSetBuilder } from "../animator/animator_set";
import NumberLinearAnimator from "../animator/number-linear-animator";
import { textAlpha } from "../animator/text-affect"
import Timeout from "../animator/timeout";
import Dialogue from "../data/dialogue";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import SimpleScene from "../scene/simple_scene"
import ImageView from "../widgets/imageview";
import TextView from "../widgets/textview";

export default class Act1 extends SimpleScene {

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, "Act 01", "夕阳无限好");
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
    this.addDialogue(new Dialogue(
      "荆棘",
      "舅舅，我来看你了，近来可好?"
    ));
    this.addDialogue(new Dialogue(
      "荆轲",
      "我这边还好，那么多年不见，你已经这么高了，随我进城把。",
      false
    ));
    this.addDialogue(new Dialogue(
      "荆棘",
      "好"
    ));
    this.setOnDialogueFinish(this.setupMainPanel.bind(this));
  }

  setupMainPanel() {
    let image = new ImageView("res/artichoke_PNG30.png");
    image.layoutParam.xcfg = Align.CENTER;
    image.layoutParam.ycfg = Align.CENTER;
    this.addView(image);
    this.forceRepaint();
  }
}