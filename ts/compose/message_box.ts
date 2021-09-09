import Colors from "../game/data/styles/colors";
import TextSizes from "../game/data/styles/text_sizes";
import { Align, LayoutType } from "../misc/layout";
import LinearLayout from "../widgets/linear_layout";
import TextView, { Text } from "../widgets/textview";

export default class MessageBox extends LinearLayout {
  title: Text;
  content: Text;

  titleView: TextView;
  contentView: TextView;

  onMessageBoxDismiss: () => void;
  constructor() {
    super();
    this.layoutParam.xcfg = this.layoutParam.ycfg =
      Align.CENTER;
    this.margin.left = this.margin.right = 20;
    this.padding.left = this.padding.right =
       this.padding.bottom = this.padding.top = 20;
    this.titleView = new TextView();
    this.contentView = new TextView();
    this.titleView.layoutParam.xcfg = Align.CENTER;
    this.contentView.layoutParam.xcfg = Align.CENTER;
    this.contentView.margin.top = 20;
    this.addView(this.titleView);
    this.addView(this.contentView);

    this.bgColor = Colors.winGrey;
    this.titleView.textColor = Colors.black;
    this.contentView.textColor = Colors.black;
    this.titleView.textSize = TextSizes.normal;
    this.contentView.textSize = TextSizes.small;
  }

  show(title: Text, content: Text) {
    this.visible = true;
    this.titleView.setText(title);
    this.contentView.setText(content);
    this.setIsDirty(true);
  }

  onTouchOutside() {
    if (this.visible) {
      this.visible = false;
      if (this.onMessageBoxDismiss) {
        let callback = this.onMessageBoxDismiss;
        this.onMessageBoxDismiss = null;
        callback();
      }
      return true;
    }
    return false;
  }
}