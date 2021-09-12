import Dialogue from "../../../../data/dialogue";
import { Player } from "../../../../data/player";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import { Text } from "../../../../widgets/textview";
import { Actors } from "../../actors";
import TextEffects from "../../styles/text_effects";

export default class Act1BuyYanWineFanwujiFirstFlow {
  static get(scene: SimpleScene): Sequence {
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Actors.instance.fanwuji.character,
          new Text("酒入愁肠，化作相思泪 (一饮而尽)"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("樊将军，我需要您手中的\f燕浊酒\r, 不知先生可否割爱").setDefaultEffect(TextEffects.goodsEffect)
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.fanwuji.character,
          new Text("我正好剩一瓶，要是寻常物品，你只管取走就是。这酒，能解相思之愁，恕我不能让"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("樊将军，您有什么忧愁之事，只管说出来，我尽力为您消除，事成之后，您能将酒给我吗？")
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.fanwuji.character,
          new Text("我是家仇血恨，恕我冒昧，你确实帮不了我。看在你这么想要这酒，我也好久没有活动手脚了，如果你能胜我，这酒就是你的。看在你是年轻人，我只出三分力"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.fanwuji.character,
          new Text("你可以在你准备好的时候找我。"),
          false
        ));
        scene.setOnDialogueFinish(() => {
          scene.hideDialogue();
          sequence.next();
        })
      }
    })
    return sequence;
  }
}