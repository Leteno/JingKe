
import TextView from "../../widgets/textview"
import {textAlpha} from "../text-affect"

test("textAlphaFadeIn", () => {
  let textView = {
    textColor: "#000000"
  } as TextView;
  textView.visible = false;

  let fadeIn = textAlpha(true, 2000, textView);
  expect(textView.visible).toBe(true);
  expect(textView.textColor).toBe("#000000")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#7f7f7f")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#ffffff")
  expect(textView.visible).toBe(true);
})

test("textAlphaFadeOut", () => {
  let textView = {
    textColor: "#ffffff"
  } as TextView;
  textView.visible = true;

  let fadeIn = textAlpha(false, 2000, textView);
  expect(textView.visible).toBe(true);
  expect(textView.textColor).toBe("#ffffff")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#7f7f7f")
  fadeIn.update(1000);
  expect(textView.textColor).toBe("#000000")
  expect(textView.visible).toBe(false);
})