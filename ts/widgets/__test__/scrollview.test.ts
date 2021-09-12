import { ClickEvent, DragEvent, PressEvent } from "../../misc/event";
import { Specify } from "../../misc/layout";
import LinearLayout from "../linear_layout";
import {ScrollView} from "../scrollview"
import { defaultCtx } from "./default_value.test";
import TestSprite from "./test_sprite.test";

test("scrollBy", () => {
  let scrollView = new ScrollView();
  scrollView.width = 200;
  scrollView.height = 400;
  scrollView.childrenMaxWidth = 300;
  scrollView.childrenMaxHeight = 600;

  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(-10);
  expect(scrollView.offsetY).toBe(-40);

  scrollView.scrollBy(-200, -200);
  expect(scrollView.offsetX).toBe(-100);
  expect(scrollView.offsetY).toBe(-200);
})

test("scrollBy big parent small children", () => {

  let scrollView = new ScrollView();
  scrollView.width = 200;
  scrollView.height = 400;
  scrollView.childrenMaxWidth = 100;
  scrollView.childrenMaxHeight = 100;

  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  // offset should be 0 all the time.
  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(200, 200);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);
})

test("scrollBy small parent with big child", () => {
  let scrollView = new ScrollView();
  scrollView.width = 100;
  scrollView.height = 100;
  scrollView.childrenMaxWidth = 200;
  scrollView.childrenMaxHeight = 400;
  
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(-10);
  expect(scrollView.offsetY).toBe(-40);

  scrollView.scrollBy(200, 200);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-200, -200);
  expect(scrollView.offsetX).toBe(-100);
  expect(scrollView.offsetY).toBe(-200);
})

test("click", () => {
  let content = new LinearLayout();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(100, 100);
  let v3 = new TestSprite(100, 100);
  content.addView(v1);
  content.addView(v2);
  content.addView(v3);

  let scrollView = new ScrollView();
  scrollView.forceHeight = 160;
  scrollView.addView(content);

  scrollView.measure(defaultCtx, 500, 500, Specify.NONE);
  scrollView.layout(500, 500);

  scrollView.onclick(new ClickEvent(20, 150));
  expect((v1.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(0);
  expect((v2.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v2.onclickInternal as jest.Mock).mock.calls[0][0])
    .toEqual({"x": 20, "y": 150})
  expect((v3.onclickInternal as jest.Mock).length)
    .toBe(0)

  scrollView.offsetX = -51;
  scrollView.offsetY = -100;
  scrollView.onclick(new ClickEvent(20, 150));
  expect((v1.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(0)
  expect((v2.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v3.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v3.onclickInternal as jest.Mock).mock.calls[0][0])
    .toEqual({"x": 71, "y": 250})
})

test("press", () => {
  let content = new LinearLayout();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(100, 100);
  let v3 = new TestSprite(100, 100);
  content.addView(v1);
  content.addView(v2);
  content.addView(v3);

  let scrollView = new ScrollView();
  scrollView.forceHeight = 160;
  scrollView.addView(content);

  scrollView.measure(defaultCtx, 500, 500, Specify.NONE);
  scrollView.layout(500, 500);

  scrollView.onpress(new PressEvent(20, 150));
  expect((v1.onpressInternal as jest.Mock).mock.calls.length)
    .toBe(0);
  expect((v2.onpressInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v2.onpressInternal as jest.Mock).mock.calls[0][0])
    .toEqual({"x": 20, "y": 150})
  expect((v3.onpressInternal as jest.Mock).length)
    .toBe(0)

  scrollView.offsetX = -51;
  scrollView.offsetY = -100;
  scrollView.onpress(new PressEvent(20, 150));
  expect((v1.onpressInternal as jest.Mock).mock.calls.length)
    .toBe(0)
  expect((v2.onpressInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v3.onpressInternal as jest.Mock).mock.calls.length)
    .toBe(1)
  expect((v3.onpressInternal as jest.Mock).mock.calls[0][0])
    .toEqual({"x": 71, "y": 250})
})

test("drag", () => {
  let scrollView = new ScrollView();
  scrollView.width = 100;
  scrollView.height = 100;
  scrollView.childrenMaxWidth = 200;
  scrollView.childrenMaxHeight = 400;

  scrollView.ondrag(new DragEvent(
    20, 40, 10, -10, 0));
  expect(scrollView.offsetY).toBe(-10);

  scrollView.ondrag(new DragEvent(
    30, 40, 10, -11, 0));
  expect(scrollView.offsetY).toBe(-11);

  // startTime is changed.
  scrollView.ondrag(new DragEvent(
    30, 40, 10, -10, 1));
  expect(scrollView.offsetY).toBe(-21);
})