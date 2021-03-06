
import { waitForMs } from "../concurency";
import {DragEvent} from "../event"
import EventHandler from "../event_handler"

function expectEqualExceptForStartTime(
  wanted: DragEvent, actual: DragEvent) {
  expect(wanted.dragX).toBe(actual.dragX);
  expect(wanted.dragY).toBe(actual.dragY);
  expect(wanted.x).toBe(actual.x);
  expect(wanted.y).toBe(actual.y);
}

test("click", () => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  let onPress = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  eventHandler.bindOnPressHandler(onPress);
  eventHandler.onpointerdown(30, 30);
  eventHandler.onpointerup(30, 30);

  expect(onPress.mock.calls.length)
    .toBe(0);
  expect(onClick.mock.calls.length)
    .toBe(1);
})

test("press", async () => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  let onPress = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  eventHandler.bindOnPressHandler(onPress);

  eventHandler.onpointerdown(30, 30);

  await waitForMs(500);
  expect(onPress.mock.calls.length)
    .toBe(1);
  expect(onClick.mock.calls.length)
    .toBe(0);
})

test("press long time", async() => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  let onPress = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  eventHandler.bindOnPressHandler(onPress);

  eventHandler.onpointerdown(30, 30);

  await waitForMs(599);
  expect(onPress.mock.calls.length)
    .toBe(2);
  expect(onClick.mock.calls.length)
    .toBe(0);
})

test("click not canceled by small move", () => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  let onPress = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  eventHandler.bindOnPressHandler(onPress);

  eventHandler.onpointerdown(30, 30);
  eventHandler.onpointermove(35, 35);
  eventHandler.onpointerup(35, 35);

  expect(onPress.mock.calls.length)
    .toBe(0);
  expect(onClick.mock.calls.length)
    .toBe(1);
})

test("click canceled by big move", () => {
  let eventHandler = new EventHandler();
  let onClick = jest.fn();
  let onPress = jest.fn();
  eventHandler.bindOnClickHandler(onClick);
  eventHandler.bindOnPressHandler(onPress);

  eventHandler.onpointerdown(30, 30);
  eventHandler.onpointermove(50, 50);
  eventHandler.onpointerup(50, 50);

  expect(onPress.mock.calls.length)
    .toBe(0);
  expect(onClick.mock.calls.length)
    .toBe(0);
})

test("drag", () => {
  let eventHandler = new EventHandler();
  let onDrag = jest.fn();
  eventHandler.bindOnDragHandler(onDrag);

  eventHandler.onpointerdown(30, 30);
  eventHandler.onpointermove(50, 50);
  expect(onDrag.mock.calls.length).toBe(1);
  expectEqualExceptForStartTime(
    onDrag.mock.calls[0][0] as DragEvent,
    new DragEvent(30, 30, 20, 20, 0)
  )

  eventHandler.onpointermove(20, 20);
  expect(onDrag.mock.calls.length).toBe(2);
  expectEqualExceptForStartTime(
    onDrag.mock.calls[1][0] as DragEvent,
    new DragEvent(30, 30, -10, -10, 0)
  )
})

test("drag several", () => {
  let eventHandler = new EventHandler();
  let onDrag = jest.fn();
  eventHandler.bindOnDragHandler(onDrag);

  eventHandler.onpointerdown(30, 30);
  eventHandler.onpointermove(50, 50);
  eventHandler.onpointerup(50, 50);

  eventHandler.onpointerdown(60, 60);
  eventHandler.onpointermove(50, 50);
  expect(onDrag.mock.calls.length).toBe(2);
  expectEqualExceptForStartTime(
    onDrag.mock.calls[1][0] as DragEvent,
    new DragEvent(60, 60, -10, -10, 0)
  );

  eventHandler.onpointermove(120, 130);
  expect(onDrag.mock.calls.length).toBe(3);
  expectEqualExceptForStartTime(
    onDrag.mock.calls[2][0] as DragEvent,
    new DragEvent(60, 60, 60, 70, 0)
  );
})