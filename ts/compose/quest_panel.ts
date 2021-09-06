import Quest from "../data/quest";
import QuestData from "../data/quest_data";
import Colors from "../game/data/styles/colors";
import ScrollViewWithButton from "../widgets/compose/scrollview_with_button";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";

export class QuestPanel extends LinearLayout {
  scrollViewWithButton: ScrollViewWithButton;
  progressBoard: ProgressBoard;
  questList: LinearLayout;
  constructor() {
    super(Orientation.HORIZONTAL);

    this.scrollViewWithButton = new ScrollViewWithButton();
    this.scrollViewWithButton.layoutParam.weight = 1;
    this.addView(this.scrollViewWithButton);

    this.questList = new LinearLayout(Orientation.VERTICAL);
    this.scrollViewWithButton.setContentView(this.questList);

    this.progressBoard = new ProgressBoard();
    this.progressBoard.layoutParam.weight = 1;
    this.addView(this.progressBoard);
  }

  setIsDirty(dirty: boolean) {
    super.setIsDirty(dirty);
    this.scrollViewWithButton.setIsDirty(dirty);
    this.progressBoard.setIsDirty(dirty);
    this.questList.setIsDirty(dirty);
  }

  update(quests: Array<Quest>) {
    this.questList.removeAllViews();
    let that: QuestPanel = this;
    quests.forEach(quest => {
      let {name, desc} = QuestData.getData(quest.type);
      let tv = new TextView(new Text(name));
      tv.textColor = Colors.black;
      tv.onclickInternal = () => {
        that.progressBoard.update(desc, quest.progress);
        return true;
      }
      that.questList.addView(tv);
    })
    this.setIsDirty(true);
  }
}

export class ProgressBoard extends LinearLayout {
  desc: TextView;
  progress: LinearLayout;
  constructor() {
    super(Orientation.VERTICAL);
    this.desc = new TextView(new Text(""));
    this.addView(this.desc);
    this.progress = new LinearLayout();
    this.addView(this.progress);
  }
  update(desc: string, progress: Array<string>) {
    this.desc.setText(new Text(desc));
    this.progress.removeAllViews();
    progress.forEach(item => {
      let tv = new TextView(new Text(item));
      this.progress.addView(tv);
    });
    this.setIsDirty(true);
  }
}