import Dialogue from "../../../data/dialogue";
import Assertion from "../../../misc/assertion";
import SimpleScene from "../../../scene/simple_scene";
import { Sequence } from "../../../schedule/sequence";
import { Option } from "../../../widgets/option_view";
import { Text } from "../../../widgets/textview"

export class Flow {
  sequence: Sequence;
  addDialogue: (data: Dialogue) => void;
  showOptionView: (title: Text, options: Array<Option>) => void;
  setOnDialogueFinished: (fn: () =>void) => void;
  hideDialogue: () => void;

  bind(scene: SimpleScene) {
    this.addDialogue = scene.addDialogue.bind(scene);
    this.showOptionView = scene.showOptionView.bind(scene);
    this.setOnDialogueFinished = scene.setOnDialogueFinish.bind(scene);
    this.hideDialogue = scene.hideDialogue.bind(scene);
  }

  reset() {
    this.sequence.reset();
  }

  constructor() {
    this.sequence = new Sequence();
    this.addDialogue = undefined;
    this.showOptionView = undefined;
    this.setOnDialogueFinished = undefined;
    this.hideDialogue = undefined;
  }

  startFlow() {
    Assertion.expectTrue(this.addDialogue != undefined);
    this.sequence.startOne();
  }
}