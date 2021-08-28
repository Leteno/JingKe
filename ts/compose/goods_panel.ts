import { BindableData } from "../data/bindable_data";
import { Prossession } from "../data/prossession";
import { Align, LayoutType } from "../misc/layout";
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

class PurchaseModel extends BindableData {
  count: number;
  minCount: number;
  maxCount: number;
  cost: number;
  constructor() {
    super();
    this.count = 1;
    this.cost = 0;
    this.maxCount = 1;
    this.minCount = 0;
  }
}

class DescriptionView extends LinearLayout {
  title: TextView;
  content: TextView;
  left: TextView;
  costLabel: TextView;
  purchaseModel: PurchaseModel;

  constructor() {
    super();
    this.orientation = Orientation.VERTICAL;
    this.purchaseModel = new PurchaseModel();

    this.title = new TextView();
    this.title.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.title.textColor = "#000000";
    this.title.textSize = 16;
    this.content = new TextView();
    this.title.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.content.textColor = "#000000";
    this.content.textSize = 12;
    this.left = new TextView();
    this.left.textColor = "#000000";
    this.left.textSize = 12;
    this.left.layoutParam.xcfg = Align.END;
    this.left.margin.bottom = 10;

    this.addView(this.title);
    this.addView(this.content);
    this.addView(this.left);

    let numberLayer = new LinearLayout();
    numberLayer.orientation = Orientation.HORIZONTAL;
    numberLayer.layoutParam.xcfg = Align.END;
    numberLayer.margin.bottom = 10;
    let plusBtn = new ImageView("res/created/plus.png");
    plusBtn.forceWidth = plusBtn.forceHeight = 20;
    let numberLabel = new TextView(new Text("1"));
    let minusBtn = new ImageView("res/created/minus.png");
    minusBtn.forceWidth = minusBtn.forceHeight = 20;
    numberLabel.margin.left = numberLabel.margin.right
      = 10;
    numberLayer.addView(minusBtn);
    numberLayer.addView(numberLabel);
    numberLayer.addView(plusBtn);
    this.addView(numberLayer);

    this.costLabel = new TextView(new Text("需 X 金"));
    this.costLabel.layoutParam.xcfg = Align.END;
    this.costLabel.margin.bottom = 10;
    this.addView(this.costLabel);

    numberLabel.bindData(
      this.purchaseModel,
      (() => {
        numberLabel.setText(new Text("" + this.purchaseModel.count));
        this.costLabel.setText(new Text(
          `需 ${this.purchaseModel.count * this.purchaseModel.cost} 金`
        ))
      }).bind(this)
    );
    plusBtn.onclickInternal = (() => {
      if (this.purchaseModel.count < this.purchaseModel.maxCount) {
        this.purchaseModel.count++;
        this.purchaseModel.dirty = true;
      }
      return true;
    }).bind(this);
    plusBtn.onpressInternal = plusBtn.onclickInternal;
    minusBtn.onclickInternal = (() => {
      if (this.purchaseModel.count > this.purchaseModel.minCount) {
        this.purchaseModel.count--;
        this.purchaseModel.dirty = true;
      }
      return true;
    }).bind(this);
    minusBtn.onpressInternal = minusBtn.onclickInternal;

    let purchaseBtn = new TextView(new Text("购买"));
    purchaseBtn.layoutParam.xcfg = Align.END;
    purchaseBtn.bgColor = "#d3d3d3";
    this.addView(purchaseBtn);
  }

  bind(goods: Prossession) {
    this.bindData(goods, DescriptionView.update);
  }

  static update(view: DescriptionView, goods: Prossession) {
    view.title.setText(new Text(
      goods.name
    ));
    view.content.setText(new Text(
      goods.functional_text
    ));
    view.left.setText(new Text(
      "剩余: " + goods.count
    ));
    view.purchaseModel.count = 1;
    view.purchaseModel.cost = goods.cost;
    view.purchaseModel.maxCount = goods.count;
    view.purchaseModel.dirty = true;
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
    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.layoutParam.xcfg = this.layoutParam.ycfg
      = Align.CENTER;
    this.margin.left = this.margin.right = 40;
    this.padding.left = this.padding.right =
      this.padding.top = this.padding.bottom = 20;
    this.bgColor = "#e6e6e6";

    let scrollButtons = new LinearLayout(
      Orientation.VERTICAL);
    scrollButtons.layoutParam.ycfg = Align.CENTER;
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
    scrollView.layoutParam.weight = 1;
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
    this.description.layoutParam.weight = 1;
    this.description.margin.left = 20;
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
      let row = new LinearLayout(Orientation.HORIZONTAL);
      row.border = new Border();
      row.border.color = "#d3d3d3";
      row.layoutParam.xLayout = LayoutType.MATCH_PARENT;
      let tv = new TextView(new Text(goods.name));
      tv.textColor = "#000000";
      tv.textSize = 16;
      tv.layoutParam.ycfg = Align.CENTER;
      tv.layoutParam.weight = 1;
      row.addView(tv);
      let img = new ImageView(goods.image);
      img.forceWidth = img.forceHeight = 30;
      img.margin.left = 20;
      row.addView(img);
      row.onclickInternal = () => {
        model.currentIndex = i;
        model.dirty = true;
        return true;
      }
      view.goodsList.addView(row);
    }
    if (model.currentIndex < 0) {
      view.description.visible = false;
    } else {
      view.description.bind(
        model.goodsList[model.currentIndex]);
      view.description.visible = true;
    }
    view.description.setIsDirty(true);
    view.goodsList.setIsDirty(true);
    view.scrollView.setIsDirty(true);
    view.setIsDirty(true);
  }
}