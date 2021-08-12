import NumberLinearAnimator from "../animator/number-linear-animator";
import Timeout from "../animator/timeout";
import { UNKNOWN } from "../data/option";
import { ClickEvent } from "../misc/event";
import { Align, LayoutType } from "../misc/layout";
import LinearLayout from "./linear_layout";
import Sprite, { Border } from "./sprite";
import TextView, { DrawFunc, Text } from "./textview";

export interface OptionCallback {
  onOptionClicked(opt: number): boolean;
}

export class Option {
  id: number;
  text: Text;

  constructor(id: number, text:Text) {
    this.id = id;
    this.text = text;
  }
}

export default class OptionView extends LinearLayout {

  titleView: TextView;
  timingView: TextView;
  timer: NumberLinearAnimator;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.border = new Border();
    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.layoutParam.xcfg = Align.START;
    this.layoutParam.ycfg = Align.CENTER;
    this.margin.left = 40;
    this.margin.right = 40;
    this.padding.top = 20;
    this.padding.bottom = 20;
    this.padding.left = 20;
    this.padding.right = 20;

    this.titleView = new TextView();
    this.titleView.layoutParam.xLayout = LayoutType.MATCH_PARENT;

    this.timingView = new TextView();
    this.timingView.visible = false;
    this.timingView.layoutParam.xcfg = Align.END;

    this.bgColor = "#aabbcc";
    this.visible = false;
  }

  show(title: Text, options: Array<Option>, callback: OptionCallback, timingInSeconds=-1) {
    this.removeAllViews();
    this.titleView.setText(title);
    this.addView(this.titleView);

    options.forEach(opt => {
      let view = this.buildOption(opt, callback);
      view.margin.top = 10;
      this.addView(view);
    });
    if (timingInSeconds > 0) {
      this.timer = new NumberLinearAnimator(
        timingInSeconds, 0, timingInSeconds * 1000
      );
      this.timer.onValChange = ((val: number) => {
        this.timingView.setText(new Text(`${Math.floor(val)}`));
      }).bind(this);
      this.timer.onStop = () => {
        this.hide();
        callback.onOptionClicked(UNKNOWN);
      };
      this.timingView.visible = true;
      this.addView(this.timingView);
    } else {
      this.timer = undefined;
      this.timingView.visible = false;
    }
    this.setIsDirty(true);
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  update(dt: number) {
    if (this.timer) {
      this.timer.update(dt);
    }
  }

  isShowing() {
    return this.visible;
  }

  onclick(event: ClickEvent) {
    if (!this.visible) return false;
    // Pass click event to lower layer
    super.onclick(event);
    // Modal dialog, accept all the click event.
    return true;
  }

  buildOption(option: Option, callback: OptionCallback):Sprite {
    let textView = new TextView(option.text);
    textView.textSize = 16;
    textView.onclickInternal = (event => {
      this.hide();
      return callback.onOptionClicked(option.id);
    }).bind(this);
    textView.padding.left = textView.padding.right =
      textView.padding.top = textView.padding.bottom = 5;
    textView.border = new Border();
    textView.bgColor = "#ccbbaa";
    return textView;
  }
}