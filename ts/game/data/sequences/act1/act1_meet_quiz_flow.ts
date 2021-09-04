import Dialogue from "../../../../data/dialogue";
import { Event, Player } from "../../../../data/player";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import {Text} from "../../../../widgets/textview"
import { UNKNOWN } from "../../../../data/option";
import { Option, OptionCallback } from "../../../../widgets/option_view";
import { ABILITY } from "../../../../data/character";

export default class Act1MeetQuizFlow {
  static get(that: SimpleScene) {
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆棘",
          new Text("舅舅，我来看你了，近来可好?")
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("我这边还好，那么多年不见，你已经这么高了，这段时间在家学了什么呢？"),
          false
        ));
        that.setOnDialogueFinish(sequence.next.bind(sequence));
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let options = new Array<Option>();
        enum OPT {
          BEAR = 0,
          DEER = 1,
          CHICKEN = 2,
        }
        let callback:OptionCallback = {
          onOptionClicked(id: number): boolean {
            switch(id) {
              case OPT.BEAR:
                console.log("You have learned how to cook bear");
                break;
              case OPT.DEER:
                console.log("You have learned how to cook deer");
                break;
              case OPT.CHICKEN:
                console.log("You have learned how to cook chicken");
                break;
              case UNKNOWN:
                console.log("Timeout");
                break;
            }
            Player.getInstance().saveChoose(Event.FRE_WHAT_LEARN, id);
            sequence.next();
            return true;
          }
        }
        let opt1 = new Option(OPT.BEAR, new Text("蒸熊掌"));
        let opt2 = new Option(OPT.DEER, new Text("蒸鹿尾"));
        let opt3 = new Option(OPT.CHICKEN, new Text("烧花鸡"));
        options.push(opt1, opt2, opt3);
        that.showOptionView(
          new Text("我学了"),
          options,
          callback,
          15
        );
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let word = "不错不错。";
        let opt = Player.getInstance().getChoose(Event.FRE_WHAT_LEARN);
        let ability = ABILITY.TRUST;
        switch(opt) {
          case 0:
            word += "熊掌可好吃了";
            ability = ABILITY.ATTACK
            break;
          case 1:
            word += "鹿尾大补啊";
            ability = ABILITY.INTELIGENCE
            break;
          case 2:
            word += "大吉大利，今晚吃鸡";
            ability = ABILITY.LOYAL
            break;
          case UNKNOWN:
          case Player.CHOOSE_NOT_FOUND:
            word += "应该是偷懒了";
            break;
        }
        Player.getInstance().character.abilities[ability]++;
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text(word),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("快随我入城把"),
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
        sequence.next();
      }
    });
    return sequence;
  }
}