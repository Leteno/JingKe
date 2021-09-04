import { Align, LayoutParams } from "../../../misc/layout";
import TextView from "../../../widgets/textview";

export class SimpleSceneViews {
  static sceneCaption: TextView;
  static sceneTitle: TextView;

  static init() {
    this.sceneCaption = new TextView();
    this.sceneTitle = new TextView();
    this.sceneCaption.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneTitle.layoutParam = new LayoutParams(
      Align.CENTER, Align.CENTER
    );
    this.sceneCaption.margin.top = -50;
    this.sceneCaption.setTransparent();
    this.sceneTitle.setTransparent();
  }
}