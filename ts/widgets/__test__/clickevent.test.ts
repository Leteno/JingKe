
import { ClickEvent } from "../../misc/event";
import { Align, LayoutParams, LayoutType, Specify } from "../../misc/layout";
import Panel from "../panel"
import SimpleView from "../simple_view";
import Sprite from "../sprite";
import TestSprite from "./test_sprite.test"
import {defaultCtx} from "./default_value.test"

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

  panel.measure({} as CanvasRenderingContext2D, 400, 400, Specify.NONE)
  panel.layout(400, 400);

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

test("padding", () => {
  let panel = new Panel();
  panel.layoutParam.xLayout = LayoutType.MATCH_PARENT;
  panel.layoutParam.yLayout = LayoutType.MATCH_PARENT;
  let view = new TestSprite(100, 100);
  panel.addView(view);

  panel.onclickInternal = jest.fn(() => {
    return true;
  });
  view.onclickInternal = jest.fn(() => {
    return true;
  });

  let ctx = {} as CanvasRenderingContext2D;
  panel.measure(ctx, 500, 500, Specify.NONE);
  panel.onclick(new ClickEvent(0, 0));
  expect((panel.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(0);
  expect((view.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1);

  panel.onclick(new ClickEvent(110, 110));
  expect((panel.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1);
  expect((view.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1);

  // After add padding
  panel.padding.left = panel.padding.top = 40;
  panel.measure(ctx, 500, 500, Specify.NONE);

  panel.onclick(new ClickEvent(0, 0));
  expect((panel.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(2);
  expect((view.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(1);

  panel.onclick(new ClickEvent(110, 110));
  expect((panel.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(2);
  expect((view.onclickInternal as jest.Mock).mock.calls.length)
    .toBe(2);
})

test("onTouchOutside", () => {
  let mainPanel = new Panel();
  mainPanel.layoutParam.xLayout = LayoutType.MATCH_PARENT;
  mainPanel.layoutParam.yLayout = LayoutType.MATCH_PARENT;
  let v1 = new TestSprite(10, 10);
  let v2 = new TestSprite(10, 10);
  mainPanel.onclickInternal = jest.fn(() => {
    return true;
  })
  v1.onclickInternal = jest.fn(() => {
    return true;
  })
  v2.onclickInternal = jest.fn(() => {
    return true;
  })

  mainPanel.addView(v1);
  mainPanel.addView(v2);

  v2.margin.top = 20;

  mainPanel.measure(defaultCtx, 100, 100, Specify.NONE);
  mainPanel.layout(100, 100);

  let clickOutside = new ClickEvent(20, 20);
  mainPanel.onclick(clickOutside);

  expect((mainPanel.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v1.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(0);
  expect((v2.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(0);

  let clickOnV2 = new ClickEvent(10, 20);
  mainPanel.onclick(clickOnV2);

  expect((mainPanel.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v1.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(0);
  expect((v2.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);

  v1.onTouchOutside = jest.fn((event: ClickEvent) => {
    // handle touch outside event.
    return true;
  });
  // re-send the click event:
  mainPanel.onclick(clickOutside);
  expect((mainPanel.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v1.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(0);
  expect((v2.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v1.onTouchOutside as jest.Mock)
    .mock.calls.length).toBe(1);

  // Still capture by v2, because we pass
  // onclick event to v2 first.
  mainPanel.onclick(clickOnV2);
  expect((mainPanel.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v1.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(0);
  expect((v2.onclickInternal as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v1.onTouchOutside as jest.Mock)
    .mock.calls.length).toBe(1);
})

test("view disabled", () => {
  let v = new TestSprite(10, 10);
  v.onclick(new ClickEvent(0, 0));
  expect((v.onclickInternal as jest.Mock).mock.calls.length).toBe(1);

  v.enable = false;
  v.onclick(new ClickEvent(0, 0));
  expect((v.onclickInternal as jest.Mock).mock.calls.length).toBe(1);
})