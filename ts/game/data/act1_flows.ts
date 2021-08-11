import Dialogue from "../../data/dialogue";
import { Text } from "../../widgets/textview";
import { Flow } from "./structure/flow";
import { Option, OptionCallback } from "../../widgets/option_view"

export class Act1Flows {
  greetingFromJuzi: Flow;

  private static instance: Act1Flows = new Act1Flows();
  static getInstance() : Act1Flows {
    return this.instance;
  }
  private constructor() {
    this.greetingFromJuzi = this.buildGreetingFromJuzi();
  }

  private buildGreetingFromJuzi() : Flow {
    let greetingFromJuzi = new Flow();
    greetingFromJuzi.sequence.addIntoSequence({
      onStart() {
        greetingFromJuzi.addDialogue(new Dialogue(
          "莫翟", new Text("你好，好久没人跟我说话了")
        ))
        greetingFromJuzi.addDialogue(new Dialogue(
          "莫翟", new Text("我是谁？这不重要，就如同我过去的理想。任山石阻难，细水间中流。挡不住了，难啊，难。")
        ))
        greetingFromJuzi.setOnDialogueFinished(() => {
          greetingFromJuzi.sequence.next();
        })
      }
    })
    greetingFromJuzi.sequence.addIntoSequence({
      onStart() {
        // TODO make it public
        enum YES_NO {
          YES,
          NO
        }
        let callback: OptionCallback = {
          onOptionClicked(op: Option): boolean {
            switch(op.id) {
              case YES_NO.YES:
                greetingFromJuzi.addDialogue(new Dialogue(
                  "莫翟", new Text("是这样吗？那就好，那就好.")
                ))
                greetingFromJuzi.setOnDialogueFinished(()=> {
                  greetingFromJuzi.hideDialogue()
                })
                break;
              case YES_NO.NO:
                greetingFromJuzi.addDialogue(new Dialogue(
                  "莫翟", new Text("难啊，难啊.")
                ))
                greetingFromJuzi.setOnDialogueFinished(()=> {
                  greetingFromJuzi.hideDialogue()
                })
                break;
            }
            return true;
          }
        }
        let op1 = new Option(
          YES_NO.YES,
          new Text("是的，我是这样子认为的"),
          callback
        );
        let op2 = new Option(
          YES_NO.NO,
          new Text("不是，征战永无止境"),
          callback
        );
        let ops = new Array<Option>()
        ops.push(op1, op2)
        greetingFromJuzi.showOptionView(
          new Text("你觉得我们有生之年会看到和平吗？"),
          ops
        )
      }
    })
    return greetingFromJuzi;
  }
}