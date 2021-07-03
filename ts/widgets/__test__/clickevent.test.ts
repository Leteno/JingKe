
import { ClickEvent } from "../../misc/event";
import { Align, LayoutParams } from "../../misc/layout";
import Panel from "../panel"
import Sprite from "../sprite";
import TestSprite from "./test_sprite.test"

test("testSimpleView", () => {
  let view = new TestSprite(100, 100);
  view.onclickInternal = () => {
    return true;
  }
  view.x = 50;
  view.y = 50;

  let event = new ClickEvent(0, 0);
  expect(view.onclick(event)).toBe(false);
  event.x = 100;
  expect(view.onclick(event)).toBe(false);
  event.y = 100;
  expect(view.onclick(event)).toBe(true);
})

test("testPanel", () => {
  let panel = new Panel()
  panel.x = panel.y = 0;
  panel.width = panel.height = 400;
  let panelClick = jest.fn<boolean, any>((all: any[]): boolean => {
    return true;
  });
  panel.onclickInternal = panelClick;

  let viewA = new TestSprite(100, 100);
  viewA.x = viewA.y = 100;
  panel.addView(viewA);
  let viewAClick = jest.fn<boolean, any>((all: any[]) :boolean => {
    return true;
  });
  viewA.onclickInternal = viewAClick;

  // miss
  let event = new ClickEvent(500, 500);
  expect(panel.onclick(event)).toBe(false);
  expect(panelClick.mock.calls.length).toBe(0);
  expect(viewAClick.mock.calls.length).toBe(0);

  // on panel
  event.x = event.y = 50;
  expect(panel.onclick(event)).toBe(true);
  expect(panelClick.mock.calls.length).toBe(1);
  expect(viewAClick.mock.calls.length).toBe(0);

  // on view
  event.x = event.y = 150;
  expect(panel.onclick(event)).toBe(true);
  expect(viewAClick.mock.calls.length).toBe(1);
  expect(panelClick.mock.calls.length).toBe(1); // no change

  // on invisible view
  event.x = event.y = 150;
  viewA.visible = false;
  expect(panel.onclick(event)).toBe(true);
  expect(panelClick.mock.calls.length).toBe(2);
  expect(viewAClick.mock.calls.length).toBe(1);
})

test("testCenterChild", () => {
  let panel = new Panel();
  panel.forceWidth = panel.forceHeight = 400;
  let panelOnClick = jest.fn(() => {
    return true;
  });
  panel.onclickInternal = panelOnClick;
  let s = new TestSprite();
  s.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
  s.forceWidth = s.forceHeight = 100;
  let spriteOnClick = jest.fn(() => {
    return true;
  });
  s.onclickInternal = spriteOnClick;
  panel.addView(s);

  panel.measure({} as CanvasRenderingContext2D)
  panel.layout();

  // Click on panel
  panel.onclick(new ClickEvent(0, 0));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(0);

  // Click on left-top of sprite.
  panel.onclick(new ClickEvent(150, 150));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(1);

  // Click on right-top of sprite.
  panel.onclick(new ClickEvent(250, 150));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(2);

  // Click on left-bottom of sprite.
  panel.onclick(new ClickEvent(150, 250));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(3);

  // Click on right-bottom of sprite.
  panel.onclick(new ClickEvent(250, 250));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(4);

  // Click on center of sprite.
  panel.onclick(new ClickEvent(200, 200));
  expect(panelOnClick.mock.calls.length).toBe(1);
  expect(spriteOnClick.mock.calls.length).toBe(5);

  // Click on right-bottom of panel.
  panel.onclick(new ClickEvent(400, 400));
  expect(panelOnClick.mock.calls.length).toBe(2);
  expect(spriteOnClick.mock.calls.length).toBe(5);

})