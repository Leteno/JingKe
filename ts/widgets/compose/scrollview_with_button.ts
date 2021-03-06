import { Align, LayoutType } from "../../misc/layout";
import ImageView from "../imageview";
import Panel from "../panel";
import { ScrollView } from "../scrollview";
import SimpleView from "../simple_view";

export default class ScrollViewWithButton extends Panel {
  scrollView: ScrollView;
  goodsUpBtn: ImageView;
  goodsDownBtn: ImageView;
  constructor(align: Align = Align.END) {
    super();

    let scrollView = new ScrollView();
    scrollView.layoutParam.xcfg = align;
    if (align == Align.START) {
      scrollView.margin.left = 20;
    } else {
      scrollView.margin.right = 20;
    }
    scrollView.layoutParam.yLayout = LayoutType.MATCH_PARENT;
    this.addView(scrollView);
    this.scrollView = scrollView;

    let upBtn = new ImageView("res/created/up.png");
    let downBtn = new ImageView("res/created/down.png");
    upBtn.forceWidth = upBtn.forceHeight = 20;
    upBtn.layoutParam.xcfg = align;
    upBtn.layoutParam.ycfg = Align.CENTER;
    upBtn.margin.top = -20;
    downBtn.forceWidth = downBtn.forceHeight = 20;
    downBtn.layoutParam.xcfg = align;
    downBtn.layoutParam.ycfg = Align.CENTER;
    downBtn.margin.top = 20;
    upBtn.onclickInternal = upBtn.onpressInternal =
      (event) => {
      scrollView.scrollBy(0, -10);
      return true;
    };
    downBtn.onclickInternal = downBtn.onpressInternal =
      (event) => {
      scrollView.scrollBy(0, 10);
      return true;
    };
    this.goodsUpBtn = upBtn;
    this.goodsDownBtn = downBtn;
    this.addView(upBtn);
    this.addView(downBtn);
  }

  setContentView(content: SimpleView) {
    this.scrollView.removeAllViews();
    this.scrollView.addView(content);
  }

  setIsDirty(dirty: boolean) {
    super.setIsDirty(dirty);
    this.scrollView.setIsDirty(dirty);
  }
}