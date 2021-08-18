
import EventHandler from "../event_handler"

function MockPointDownEvent(
  x: number, y: number) {
  let point = new PointerEvent("pointerdown");
  point.initMouseEvent("onpointerdown",
    true, true, window, 0,
    x, y, 0, 0,
    false, false, false,false, 0,null
  );
  return point;
}

test("click", () => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  let point = MockPointDownEvent(30, 30);
  eventHandler.onpointerdown(point);
  eventHandler.onpointerup(point);

  expect(onClick.mock.calls.length)
    .toBe(1);
})