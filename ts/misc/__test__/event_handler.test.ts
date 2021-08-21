
import { waitForMs } from "../concurency";
import EventHandler from "../event_handler"

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