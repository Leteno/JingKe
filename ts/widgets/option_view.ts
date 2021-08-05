import { ClickEvent } from "../misc/event";
import { Align, LayoutType } from "../misc/layout";
import LinearLayout from "./linear_layout";
import Sprite, { Border } from "./sprite";
import TextView, { DrawFunc, Text } from "./textview";

export interface OptionCallback {
  onOptionClicked(Option): boolean;
}

export class Option {
  id: number;
  text: Text;
  callback: OptionCallback;

  constructor(id: number, text:Text, callback: OptionCallback) {
    this.id = id;
    this.text = text;
    this.callback = callback;
  }
}

export default class OptionView extends LinearLayout {

  titleView: TextView;

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

    this.bgColor = "#aabbcc";
    this.visible = false;
  }

  show(title: Text, options: Array<Option>) {
    this.removeAllViews();
    this.titleView.setText(title);
    this.addView(this.titleView);

    options.forEach(opt => {
      let view = this.buildOption(opt);
      view.margin.top = 10;
      this.addView(view);
    });
    this.setIsDirty(true);
    this.visible = true;
  }

  hide() {
    this.visible = false;
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

  buildOption(option: Option):Sprite {
    let textView = new TextView(option.text);
    textView.textSize = 16;
    textView.onclickInternal = (event => {
      this.hide();
      return option.callback.onOptionClicked(option);
    }).bind(this);
    textView.padding.left = textView.padding.right =
      textView.padding.top = textView.padding.bottom = 5;
    textView.border = new Border();
    textView.bgColor = "#ccbbaa";
    return textView;
  }
}