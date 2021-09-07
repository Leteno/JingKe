import Colors from "../game/data/styles/colors";
import { LayoutType } from "../misc/layout";
import Panel from "../widgets/panel";
import TextView, { Text } from "../widgets/textview";
import { LogModel } from "./debug_log";

export default class DebugView extends Panel {
  static instance: DebugView = new DebugView();
  text: TextView;

  constructor() {
    super();
    this.text = new TextView(new Text(""));
    this.text.textSize = 16;
    this.text.textColor = Colors.white;
    this.text.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.text.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    this.addView(this.text);
    this.bindData(LogModel.instance, DebugView.update);
  }
  
  static update(v: DebugView, m: LogModel) {
    v.text.setText(new Text(m.getText()));
    v.setIsDirty(true);
  }
}