import { BindableData } from "../data/bindable_data";
import { Prossession } from "../data/prossession";
import { Align, LayoutType } from "../misc/layout";
import ImageView from "../widgets/imageview";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel"
import { ScrollView } from "../widgets/scrollview";
import { Border } from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";

class ProssessionModel extends BindableData {
  items: Array<Prossession>;
  selectIndex: number;
  constructor() {
    super();
    this.items = new Array<Prossession>();
    this.selectIndex = -1;
  }
}

export class UserProssessionView extends Panel {

  readonly model: ProssessionModel;

  private scrollView: ScrollView;
  private prossessionListView: LinearLayout;
  private descriptionView: TextView;

  constructor() {
    super();

    this.model = new ProssessionModel();

    this.prossessionListView = new LinearLayout();
    this.prossessionListView.forceWidth = 200;
    this.prossessionListView.orientation =
      Orientation.VERTICAL;
    let scrollView = new ScrollView();
    scrollView.layoutParam.xcfg = Align.END;
    scrollView.margin.right = 20;
    scrollView.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    scrollView.addView(this.prossessionListView);
    this.scrollView = scrollView;
    this.addView(scrollView);

    let upBtn = new ImageView("res/created/up.png");
    let downBtn = new ImageView("res/created/down.png");
    upBtn.forceWidth = upBtn.forceHeight = 20;
    upBtn.layoutParam.xcfg = Align.END;
    upBtn.layoutParam.ycfg = Align.CENTER;
    upBtn.margin.top = -20;
    downBtn.forceWidth = downBtn.forceHeight = 20;
    downBtn.layoutParam.xcfg = Align.END;
    downBtn.layoutParam.ycfg = Align.CENTER;
    downBtn.margin.top = 20;
    upBtn.onclickInternal = upBtn.onpressInternal =
      (event) => {
      scrollView.scrollBy(0, 10);
      return true;
    };
    downBtn.onclickInternal = downBtn.onpressInternal =
      (event) => {
      scrollView.scrollBy(0, -10);
      return true;
    };
    this.addView(upBtn);
    this.addView(downBtn);

    this.descriptionView = new TextView();
    this.descriptionView.margin.right =
      this.prossessionListView.forceWidth + 20;
    this.descriptionView.textColor = "black";
    this.descriptionView.textSize = 12;
    this.addView(this.descriptionView);

    this.bindData(this.model, UserProssessionView.updateProssessionListView);
  }

  static updateProssessionListView(
    view: UserProssessionView, model: ProssessionModel) {
    view.prossessionListView.removeAllViews();
    for (let i = 0; i < model.items.length; i++) {
      let prossession = model.items[i];
      let tv = new TextView(
        new Text(prossession.name));
      tv.border = new Border();
      tv.border.color = "black";
      tv.textColor = "black";
      tv.textSize = 12;
      tv.layoutParam.xcfg = Align.END;
      tv.onclickInternal = (event) => {
        model.selectIndex = i;
        model.dirty = true;
        return true;
      }
      view.prossessionListView.addView(tv);
    }
    if (model.selectIndex < 0 || model.selectIndex >= model.items.length) {
      view.descriptionView.setText(new Text(""));
    } else {
      let item = model.items[model.selectIndex];
      view.descriptionView.setText(new Text(
        "名字: " + item.name + "\n"
        + "数目: " + item.count + "\n"
        + "功效: " + item.functional_text
      ));
    }
    view.prossessionListView.setIsDirty(true);
    view.scrollView.setIsDirty(true);
    view.descriptionView.setIsDirty(true);
    view.setIsDirty(true);
  }
}