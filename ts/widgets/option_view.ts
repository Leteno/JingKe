import { ClickEvent } from "../misc/event";
import { Align, LayoutType } from "../misc/layout";
import Panel from "./panel";
import Sprite, { Border } from "./sprite";
import TextView, { DrawFunc } from "./textview";

export interface OptionCallback {
  onOptionClicked(Option): boolean;
}

export class Option {
  text: string;
  callback: OptionCallback;
  textEffects: Map<string, DrawFunc>;

  constructor(text:string, callback: OptionCallback) {
    this.text = text;
    this.callback = callback;
    this.textEffects = new Map<string, DrawFunc>();
  }

  addTextEffect(text: string, fn: DrawFunc) {
    this.textEffects.set(text, fn);
  }
}

export default class OptionView extends Panel {

  titleView: TextView;

  constructor(canvas: HTMLCanvasElement, title: string, options: Array<Option>) {
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

    this.titleView = new TextView(title);
    this.titleView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.addView(this.titleView);

    let marginTop = 40;
    options.forEach(opt => {
      let view = this.buildOption(opt);
      view.margin.top = marginTop;
      marginTop += 40;
      this.addView(view);
    });

    this.bgColor = "#aabbcc";
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
    textView.onclickInternal = event => {
      return option.callback.onOptionClicked(option);
    };
    textView.padding.left = textView.padding.right =
      textView.padding.top = textView.padding.bottom = 5;
    textView.border = new Border();
    textView.bgColor = "#ccbbaa";
    option.textEffects.forEach((fn, text) => {
      textView.updatePatternDrawFunc(
        text, fn
      );
    });
    return textView;
  }
}