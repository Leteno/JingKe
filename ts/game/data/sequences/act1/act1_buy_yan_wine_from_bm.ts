import Dialogue from "../../../../data/dialogue";
import { Player } from "../../../../data/player";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import { Text } from "../../../../widgets/textview";
import { Actors } from "../../actors";
import TextEffects from "../../styles/text_effects";

export default class Act1BuyYanWineFromBm {
  static get(scene: SimpleScene):Sequence {
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("客官，请问你想要什么"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("掌柜的，请问你有\f燕浊酒\r卖吗？").setDefaultEffect(TextEffects.goodsEffect)
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("这位客官你真识货，这个燕浊酒，性烈，味纯，其他国家的人还真品不出来，只可惜..."),
          false
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("可惜什么？")
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("只可惜这段时间往东乡的路，经常有虎出没，来往商人少了，这酒也就来不及进货，所以存货不多"),
          false
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("今早，\f樊于期\r大爷买走最后的俩瓶，所以就没了").setDefaultEffect(TextEffects.nameEffect),
          false
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("是\f太子府\r那位吗？").setDefaultEffect(TextEffects.placeEffect)
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("正是"),
          false
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("多谢告知，告辞")
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.businessman.character,
          new Text("客官慢走，我这有很多药材盔甲，你需要的时候随时来我这买..."),
          false
        ))
        scene.setOnDialogueFinish(() => {
          sequence.next();
        });
      }
    })
    return sequence;
  }
}