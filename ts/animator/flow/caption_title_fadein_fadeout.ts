import TextView from "../../widgets/textview";
import { AnimatorSetBuilder } from "../animator_set";
import { MeanWhileBuilder } from "../meanwhile";
import { textAlpha } from "../text-affect";

export class CaptionTitleFadeInFadeOut {
  static getAnimator(captionView: TextView, titleView: TextView) {

    let captionFadeIn = textAlpha(true, 2000, captionView);
    let titleFadeIn = textAlpha(true, 2500, titleView);
    let captionFadeOut = textAlpha(false, 2000, captionView);
    let titleFadeOut = textAlpha(false, 2000, titleView);
    let fadeOut = new MeanWhileBuilder()
      .join(captionFadeOut)
      .join(titleFadeOut)
      .build();
    let animation = new AnimatorSetBuilder()
      .after(captionFadeIn)
      .after(titleFadeIn)
      .after(fadeOut)
      .build();
    return animation;
  }
}