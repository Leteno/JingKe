
import TextView from "../../widgets/textview"
import {textAlpha} from "../text-affect"

test("textAlphaFadeIn", () => {
  let textView = {
    textColor: "#FFFFFF"
  } as TextView;

  let fadeIn = textAlpha(true, 2000, textView);
  expect(textView.textColor).toBe("#FFFFFF")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#7f7f7f")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#000000")
})

test("textAlphaFadeOut", () => {
  let textView = {
    textColor: "#000000"
  } as TextView;

  let fadeIn = textAlpha(false, 2000, textView);
  expect(textView.textColor).toBe("#000000")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#7f7f7f")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#fefefe")
})