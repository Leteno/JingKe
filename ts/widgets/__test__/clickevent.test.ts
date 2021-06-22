
import { ClickEvent } from "../../misc/event";
import Panel from "../panel"
import Sprite from "../sprite"

test("testSimpleView", () => {
  let view = new Sprite();
  view.width = 100;
  view.height = 100;
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

  let viewA = new Sprite();
  viewA.x = viewA.y = 100;
  viewA.width = viewA.height = 100;
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

})