
import TextViewStateMachine from "../textview_state_machine"
import {DrawItem} from "../textview_state_machine"

test("normal", () => {
  let machine = new TextViewStateMachine();
  machine.parse("Hello world, 郑", 10, 100, 10, 1);
  expect(machine.output().length).toBe(1)
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 23, 10, "Hello world, 郑", false)
  )
})

test("two line", () => {
  let machine = new TextViewStateMachine();
  machine.parse("恭喜发财，红包拿来", 10, 60, 10, 1);
  expect(machine.output().length).toBe(2);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 60, 10, "恭喜发财，红", false)
  )
  expect(machine.output()[1]).toEqual(
    new DrawItem(0, 10, 30, 10, "包拿来", false)
  )
})

test("two line, first line ends with english words", () => {
  let machine = new TextViewStateMachine();
  machine.parse("张先生 Good Morning 啊，吃点早餐把", 10, 80, 10, 5);
  expect(machine.output().length).toBe(3);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 60, 10, "张先生 Good ", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(0, 10, 80, 10, "Morning 啊，吃点", false))
  expect(machine.output()[2]).toEqual(
    new DrawItem(0, 20, 30, 10, "早餐把", false))
})