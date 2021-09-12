import Dialogue from "../../../../data/dialogue";
import { Player } from "../../../../data/player";
import Quest from "../../../../data/quest";
import QuestData, { QuestType } from "../../../../data/quest_data";
import { Specials } from "../../../../data/specials";
import SimpleScene from "../../../../scene/simple_scene";
import { Sequence } from "../../../../schedule/sequence";
import DBManager from "../../../../storage/db_manager";
import { Text } from "../../../../widgets/textview";
import { Actors } from "../../actors";
import TextEffects from "../../styles/text_effects";

export default class Act1TaizifuGreeting {
  static get(scene: SimpleScene):Sequence {
    let sequence = new Sequence();
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Actors.instance.taizidan.character,
          new Text("荆先生，你回来得正好，我有要事跟你商量"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.taizidan.character,
          new Text("这位是? (指着你)"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.jinke.character,
          new Text("这是我的侄子"),
        ));
        if (Actors.instance.taizidan.friendship > 60) {
          scene.addDialogue(new Dialogue(
            Actors.instance.taizidan.character,
            new Text("真是一表人才，在这座城里，你买任何东西都算我的"),
            false,
          ))
          scene.setOnDialogueFinish(() => {
            Player.instance.character.specials.push(
              Specials.instance.taizidandeenchong);
            DBManager.getInstance().save();
            scene.showMessageBox(
              new Text("获得特技 太子丹的恩宠"),
              new Text("在燕城东西随便拿，理论上他们都会找太子丹要钱，理论上。"),
              () => {
                sequence.next();
              }
            )
          });
        } else {
          scene.addDialogue(new Dialogue(
            Actors.instance.taizidan.character,
            new Text("真是一表人才，不错不错"),
            false,
          ));
          scene.setOnDialogueFinish(() => {
            sequence.next();
          });
        }
      }
    });
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Actors.instance.taizidan.character,
          new Text("荆先生，你整顿好这位少侠后，来我房里，我有事情要跟你商量，先走了"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.jinke.character,
          new Text("好")
        ));
        scene.setOnDialogueFinish(() => {
          scene.showMessageBox(
            new Text("太子已经远去"),
            new Text(""),
            () => {
              sequence.next();
            }
          )
        })
      }
    });
    sequence.addIntoSequence({
      onStart() {
        scene.showMessageBox(
          new Text("荆轲轻叹一声"),
          new Text(""),
          () => {
            sequence.next();
          }
        )
      }
    });
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("舅舅，怎么了？")
        ))
        scene.addDialogue(new Dialogue(
          Actors.instance.jinke.character,
          new Text("没事，就是有点累了"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.jinke.character,
          new Text("你可以去城里转一下，我去办点事，待会找你。"),
          false
        ));
        scene.addDialogue(new Dialogue(
          Actors.instance.jinke.character,
          new Text("对了，我酒壶没酒了，你帮我买一下 \f燕浊酒\r")
            .setDefaultEffect(TextEffects.goodsEffect),
          false
        ));
        scene.setOnDialogueFinish(() => {
          Player.instance.money += 200;
          scene.showMessageBox(
            new Text(""),
            new Text("金钱 + 200"),
            () => {
              let quest = new Quest();
              quest.type = QuestType.BuyWineForJingke;
              Player.instance.quests.push(quest);
              DBManager.getInstance().save();
              scene.showMessageBox(
                new Text("获得任务： 买燕浊酒"),
                new Text("燕多苦寒之地，燕声悲怆，燕酒高烈"),
                () => {
                  scene.showMessageBox(
                    new Text("（荆轲离去）"),
                    new Text(""),
                    () => {
                      sequence.next();
                    }
                  )
                }
              )
            }
          )
        });
      }
    });
    sequence.addIntoSequence({
      onStart() {
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("（奇怪，舅舅怎么刚刚神情恍惚，他是有什么心事吗？）")
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("（舅舅武功很好，人也很聪明，村里的小孩都是以他为榜样）")
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("（第一次看到舅舅如此，估计是遇上什么事了，我要打探一下，帮帮他。）")
        ))
        scene.addDialogue(new Dialogue(
          Player.instance.character,
          new Text("不过现在的我也只能帮他买酒了（苦笑）")
        ))
        scene.setOnDialogueFinish(() => {
          scene.showMessageBox(
            new Text("获得任务 荆轲的叹息"),
            new Text("你从小听说舅舅是一个有志向了不起的人，他是发生什么事了吗？你想调查一下，并帮助他"),
            () => {
              let quest = new Quest();
              quest.type = QuestType.JingkeConfuzed;
              Player.instance.quests.push(quest);
              scene.hideDialogue();
              sequence.next();
            }
          )
        })
      }
    });
    return sequence;
  }
}