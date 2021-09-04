import Dialogue from "../../../../data/dialogue";
import { Event, Player } from "../../../../data/player";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import {Text} from "../../../../widgets/textview"
import { OPTION3, UNKNOWN } from "../../../../data/option";
import { Option, OptionCallback } from "../../../../widgets/option_view";
import { ABILITY } from "../../../../data/character";
import TextEffects from "../../styles/text_effects";
import { Specials } from "../../../../data/specials";
import { Actors } from "../../actors";
import { GameState } from "../../../game_state";

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
          new Text("我这边还好，那么多年不见，你已经这么高了."),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("这些年你都做了什么呢？"),
          false
        ))
        that.setOnDialogueFinish(sequence.next.bind(sequence));
      }
    });
    sequence.addIntoSequence({
      onStart() {
        let options = new Array<Option>();
        enum OPT {
          JIANSHU = 0,
          SUZI = 1,
          FANGNIU = 2,
        }
        let opt1 = new Option(
          OPT.JIANSHU,
          new Text("学习剑术(\f勇武\r+3)")
            .setDefaultEffect(TextEffects.abilityEffect));
        let opt2 = new Option(
          OPT.SUZI,
          new Text("学习苏子的书(\f谋略\r+3)")
            .setDefaultEffect(TextEffects.abilityEffect));
        let opt3 = new Option(
          OPT.FANGNIU,
          new Text("给爹爹放牛(获得特性\f朴素\r)")
            .setDefaultEffect(TextEffects.specialEffect));
        options.push(opt1, opt2, opt3);
        let callback:OptionCallback = {
          onOptionClicked(id: number): boolean {
            switch(id) {
              case OPT.JIANSHU:
                Player.instance.character.abilities[ABILITY.ATTACK] += 3;
                break;
              case OPT.SUZI:
                Player.instance.character.abilities[ABILITY.INTELIGENCE] += 3;
                break;
              case OPT.FANGNIU:
                Player.instance.character.specials.push(
                  Specials.instance.simpleAndNaive);
                Player.instance.character.dirty = true;
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
        that.showOptionView(
          new Text("那段时间，我"),
          options,
          callback,
          15
        );
      }
    });
    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("挺好的，你未来想做什么吗？"),
          false
        ));
        that.setOnDialogueFinish(() => {
          let opt1 = new Option(
            OPTION3.OP1,
            new Text("努力奋斗，为太子效力(\f太子丹\r的好感 + 80)")
              .setDefaultEffect(TextEffects.nameEffect));
          let opt2 = new Option(
            OPTION3.OP2,
            new Text("行侠仗义！(获得特技\f义薄云天\r)")
              .setDefaultEffect(TextEffects.specialEffect));
          let opt3 = new Option(
            OPTION3.OP3,
            new Text("这世道太乱了，我。。。我不知道")
          );
          let options = [opt1, opt2, opt3];
          that.showOptionView(new Text("我未来想做什么？"), options, {
            onOptionClicked(opt: number) {
              switch(opt) {
                case OPTION3.OP1:
                  Actors.instance.taizidan.friendship += 80;
                  break;
                case OPTION3.OP2:
                  Player.instance.character.specials.push(
                    Specials.instance.yiboyuntian);
                  Player.instance.character.dirty = true;
                  break;
                case OPTION3.OP3:
                  GameState.instance.recordState("ConfusedAtWar");
                  break;
              }
              sequence.next();
              return true;
            }
          })
        });
      }
    });

    sequence.addIntoSequence({
      onStart() {
        if (!GameState.instance.hasEnterState("ConfusedAtWar")) {
          sequence.next();
          return;
        }
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("我以前很想练的一身好武艺，行侠仗义，建功立业，却只能放歌闹市之中，终不得志。"),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("幸得田光先生，我得以见重于太子。"),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("然而之后各种事情的发生，我也开始有点迷糊了"),
          false
        ));
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("先不聊这了"),
          false
        ));
        that.setOnDialogueFinish(() => {
          that.showMessageBox(
            new Text("获得任务：调查荆轲的困惑"),
            new Text("调查清楚叔叔的困惑"),
            () => {
              sequence.next();
            });
        })
      }
    });

    sequence.addIntoSequence({
      onStart() {
        that.addDialogue(new Dialogue(
          "荆轲",
          new Text("我们进城把."),
          false
        ));
        that.setOnDialogueFinish(() => {
          that.hideDialogue();
          sequence.next();
        });
      }
    });
    return sequence;
  }
}