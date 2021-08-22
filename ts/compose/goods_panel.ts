import { BindableData } from "../data/bindable_data";
import { Prossession } from "../data/prossession";
import { LayoutType } from "../misc/layout";
import ImageView from "../widgets/imageview";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import { ScrollView } from "../widgets/scrollview";
import { Border } from "../widgets/sprite";
import TextView from "../widgets/textview";
import {Text} from "../widgets/textview"

export class GoodsPanelModel extends BindableData {
  goodsList: Array<Prossession>;
  currentIndex: number;
  constructor() {
    super();
    this.goodsList = new Array<Prossession>();
    this.currentIndex = -1;
  }
}

class DescriptionView extends LinearLayout {
  title: TextView;
  content: TextView;
  left: TextView;
  constructor() {
    super();
    this.orientation = Orientation.VERTICAL;

    this.title = new TextView();
    this.content = new TextView();
    this.left = new TextView();
    this.addView(this.title);
    this.addView(this.content);
    this.addView(this.left);
  }

  bind(goods: Prossession) {
    this.bindData(goods, DescriptionView.update);
  }

  static update(view: DescriptionView, goods: Prossession) {
    view.title.setText(new Text(
      goods.name
    ));
    view.content.setText(new Text(
      goods.functional
    ));
    view.left.setText(new Text(
      "剩余: " + goods.count
    ));
  }
}

export default class GoodsPanel extends LinearLayout {
  scrollView: ScrollView;
  goodsList: LinearLayout;
  goodsUpBtn: ImageView;
  goodsDownBtn: ImageView;
  description: DescriptionView;
  constructor() {
    super();
    this.orientation = Orientation.HORIZONTAL;

    let scrollButtons = new LinearLayout(
      Orientation.VERTICAL);
    let up = new ImageView("res/created/up.png");
    up.forceWidth = up.forceHeight = 20;
    let down = new ImageView("res/created/down.png");
    down.forceWidth = down.forceHeight = 20;
    scrollButtons.addView(up);
    scrollButtons.addView(down);
    this.addView(scrollButtons);
    this.goodsUpBtn = up;
    this.goodsDownBtn = down;

    let scrollView = new ScrollView();
    scrollView.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    this.scrollView = scrollView;
    this.goodsList = new LinearLayout(
      Orientation.VERTICAL);
    this.scrollView.addView(this.goodsList);
    this.addView(this.scrollView);
    up.onclickInternal = up.onpressInternal =
      (event) => {
        scrollView.scrollBy(0, -10);
        return true;
      };
    down.onclickInternal = down.onpressInternal =
      (event) => {
        scrollView.scrollBy(0, 10);
        return true;
      };

    this.description = new DescriptionView();
    this.addView(this.description);
  }

  onTouchOutside() {
    if (this.visible) {
      this.visible = false;
      return true;
    }
    return false;
  }
  bindModel(model: GoodsPanelModel) {
    this.bindData(model, GoodsPanel.update);
  }

  static update(view: GoodsPanel, model: GoodsPanelModel) {
    view.goodsList.removeAllViews();
    for (let i = 0; i < model.goodsList.length; i++) {
      let goods = model.goodsList[i];
      let tv = new TextView(new Text(goods.name));
      tv.border = new Border();
      tv.border.color = "#d3d3d3";
      tv.onclickInternal = () => {
        model.currentIndex = i;
        model.dirty = true;
        return true;
      }
      view.goodsList.addView(tv);
    }
    if (model.currentIndex < 0) {
      view.description.visible = false;
    } else {
      view.description.bind(
        model.goodsList[model.currentIndex]);
      view.description.visible = true;
    }
  }
}