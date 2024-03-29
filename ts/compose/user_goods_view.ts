import { BindableData } from "../data/bindable_data";
import { Goods } from "../data/goods";
import Colors from "../game/data/styles/colors";
import { Align, LayoutType } from "../misc/layout";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel"
import { ScrollView } from "../widgets/scrollview";
import { Border } from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";

class GoodsModel extends BindableData {
  items: Array<Goods>;
  selectIndex: number;
  money: number;
  constructor() {
    super();
    this.items = new Array<Goods>();
    this.selectIndex = -1;
  }
}

export class UserGoodsView extends Panel {

  readonly model: GoodsModel;

  private scrollView: ScrollView;
  private prossessionListView: LinearLayout;
  private descriptionView: TextView;
  private moneyView: TextView;

  constructor() {
    super();

    this.model = new GoodsModel();

    this.prossessionListView = new LinearLayout();
    this.prossessionListView.forceWidth = 200;
    this.prossessionListView.orientation =
      Orientation.VERTICAL;
    this.scrollView = new ScrollView();
    this.scrollView.layoutParam.xcfg = Align.END;
    this.scrollView.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    this.scrollView.addView(this.prossessionListView);
    this.addView(this.scrollView);

    this.descriptionView = new TextView();
    this.descriptionView.margin.right =
      this.prossessionListView.forceWidth + 20;
    this.descriptionView.textColor = "black";
    this.descriptionView.textSize = 12;
    this.addView(this.descriptionView);

    this.moneyView = new TextView();
    this.moneyView.margin.right = this.descriptionView.margin.right;
    this.moneyView.layoutParam.ycfg = Align.END;
    this.moneyView.textColor = Colors.black;
    this.moneyView.textSize = 12;
    this.addView(this.moneyView);

    this.bindData(this.model, UserGoodsView.updateGoodsListView);
  }

  static updateGoodsListView(
    view: UserGoodsView, model: GoodsModel) {
    view.prossessionListView.removeAllViews();
    for (let i = 0; i < model.items.length; i++) {
      let goods = model.items[i];
      let tv = new TextView(
        new Text(goods.info.name));
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
        "名字: " + item.info.name + "\n"
        + "数目: " + item.count + "\n"
        + "功效: " + item.info.functional_text
      ));
    }
    view.moneyView.setText(new Text(`剩余金钱 ${model.money}`))
    view.prossessionListView.setIsDirty(true);
    view.scrollView.setIsDirty(true);
    view.descriptionView.setIsDirty(true);
    view.setIsDirty(true);
  }
}