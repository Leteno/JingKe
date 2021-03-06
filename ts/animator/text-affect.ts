import TextView from "../widgets/textview";
import Animator from "./animator";
import NumberLinearAnimator from "./number-linear-animator";

/**
 * control textView's alpha, support white <=> black only
 * @param fadeIn fadeIn if true, otherwise fadeOut
 */
export function textAlpha(
  fadeIn: boolean,
  time: number,
  textView: TextView
) : NumberLinearAnimator {
  let from = 255, to = 0;
  if (fadeIn) {
    from = 0; to = 255;
  }
  let fadeInAnimator = new NumberLinearAnimator(from, to, time);
  if (from == 0) textView.visible = true;
  fadeInAnimator.onValChange = val => {
    let alpha = Math.floor(val).toString(16);
    if (alpha.length == 1) {
      alpha = "0" + alpha;
    }
    if (val == to && val == 0) textView.visible = false;
    let color = `#${alpha}${alpha}${alpha}`;
    textView.textColor = color;
  }
  return fadeInAnimator;
}