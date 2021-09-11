import { BindableData } from "../data/bindable_data";
import { Player } from "../data/player";
import { Goods } from "../data/goods";
import Assertion from "../misc/assertion";
import { Clone } from "../misc/clone";
import { Align, LayoutType } from "../misc/layout";
import DBManager from "../storage/db_manager";
import ScrollViewWithButton from "../widgets/compose/scrollview_with_button";
import ImageView from "../widgets/imageview";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import { ScrollView } from "../widgets/scrollview";
import { Border } from "../widgets/sprite";
import TextView from "../widgets/textview";
import {Text} from "../widgets/textview"

export class GoodsPanelModel extends BindableData {
  goodsList: Array<Goods>;
  currentIndex: number;
  constructor() {
    super();
    this.goodsList = new Array<Goods>();
    this.currentIndex = -1;
  }
}

class PurchaseModel extends BindableData {
  count: number;
  minCount: number;
  maxCount: number;
  cost: number;
  original: Goods;
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
  numberLabel: TextView;
  costLabel: TextView;
  purchaseBtn: TextView;
  yourMoneyLabel: TextView;
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
    this.numberLabel = new TextView(new Text("1"));
    let minusBtn = new ImageView("res/created/minus.png");
    minusBtn.forceWidth = minusBtn.forceHeight = 20;
    this.numberLabel.margin.left = this.numberLabel.margin.right
      = 10;
    numberLayer.addView(minusBtn);
    numberLayer.addView(this.numberLabel);
    numberLayer.addView(plusBtn);
    this.addView(numberLayer);

    this.costLabel = new TextView(new Text("需 X 金"));
    this.costLabel.layoutParam.xcfg = Align.END;
    this.costLabel.margin.bottom = 10;
    this.addView(this.costLabel);

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

    this.yourMoneyLabel = new TextView(new Text(
      `您的金钱: ${Player.getInstance().money}`));
    this.yourMoneyLabel.layoutParam.xcfg = Align.END;
    this.addView(this.yourMoneyLabel);

    this.purchaseBtn = new TextView(new Text("购买"));
    this.purchaseBtn.layoutParam.xcfg = Align.END;
    this.purchaseBtn.bgColor = "#d3d3d3";
    this.purchaseBtn.onclickInternal = (() => {
      let cost = this.purchaseModel.cost * this.purchaseModel.count;
      Assertion.expectTrue(Player.getInstance().money > cost);
      Player.getInstance().money -= cost;
      this.yourMoneyLabel.setText(new Text(
        `您的金钱: ${Player.getInstance().money}`));
      let possession = Clone.clone(this.purchaseModel.original) as Goods;
      possession.count = this.purchaseModel.count;
      Player.getInstance().possessions.push(possession);
      DBManager.getInstance().save();
      this.purchaseModel.original.count -= this.purchaseModel.count;
      this.purchaseModel.count = 1;
      this.purchaseModel.dirty = true;
      this.purchaseModel.original.dirty = true;
      return true;
    }).bind(this);
    this.addView(this.purchaseBtn);

    this.bindData(this.purchaseModel, DescriptionView.bindModel);
  }

  update(goods: Goods) {
    this.title.bindData(goods, ((v: DescriptionView, d: Goods) => {
      this.title.setText(new Text(
        d.info.name
      ));
      this.content.setText(new Text(
        d.info.functional_text
      ));
      this.left.setText(new Text(
        "剩余: " + d.count
      ));
    }).bind(this));

    // 暂时不考虑 goods change 之后，还需要更新 purchaseModel.
    let copy = Clone.clone(goods) as Goods;
    Player.getInstance().applyGoodsEffect(copy);
    this.purchaseModel.count = 1;
    this.purchaseModel.cost = copy.cost;
    this.purchaseModel.maxCount = copy.count;
    this.purchaseModel.original = goods;
    this.purchaseModel.dirty = true;
  }

  static bindModel(view: DescriptionView, data: PurchaseModel) {
    view.numberLabel.setText(new Text("" + view.purchaseModel.count));
    let currentCost = view.purchaseModel.cost * view.purchaseModel.count;
    if (!view.purchaseModel.original) {
      view.costLabel.setText(new Text(
        `需 ${currentCost} 金`
      ));
      return;
    }
    let originalCost = view.purchaseModel.original.cost * view.purchaseModel.count;
    if (originalCost == currentCost) {
      view.costLabel.setText(new Text(
        `需 ${currentCost} 金`
      ));
    } else {
      // The cost is changed.
      let gap = currentCost - originalCost;
      if (gap > 0) {
        view.costLabel.setText(new Text(
          `需 ${currentCost}(+${gap}) 金`
        ));
      } else {
        view.costLabel.setText(new Text(
          `需 ${currentCost}(${gap}) 金`
        ));
      }
    }
    view.yourMoneyLabel.setText(new Text(
      `您的金钱: ${Player.getInstance().money}`));
    view.purchaseBtn.enable = Player.getInstance().money > currentCost;
  }
}

export default class GoodsPanel extends LinearLayout {
  scrollView: ScrollViewWithButton;
  goodsList: LinearLayout;
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

    let scrollView = new ScrollViewWithButton(Align.START);
    scrollView.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    scrollView.layoutParam.weight = 1;
    this.scrollView = scrollView;
    this.goodsList = new LinearLayout(
      Orientation.VERTICAL);
    this.scrollView.setContentView(this.goodsList);
    this.addView(this.scrollView);

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
      let tv = new TextView(new Text(goods.info.name));
      tv.textColor = "#000000";
      tv.textSize = 16;
      tv.layoutParam.ycfg = Align.CENTER;
      tv.layoutParam.weight = 1;
      row.addView(tv);
      let img = new ImageView(goods.info.image);
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
      view.description.update(
        model.goodsList[model.currentIndex]);
      view.description.visible = true;
    }
    view.description.setIsDirty(true);
    view.goodsList.setIsDirty(true);
    view.scrollView.setIsDirty(true);
    view.setIsDirty(true);
  }
}