
import TextViewStateMachine from "../textview_state_machine"
import {DrawItem} from "../textview_state_machine"

test("normal", () => {
  let machine = new TextViewStateMachine();
  machine.parse("Hello world, 郑", 10, 100, 10, 1);
  expect(machine.output().length).toBe(1)
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 23, 10, "Hello world, 郑", false)
  )
  expect(machine.maxWidth).toBe(23);
  expect(machine.maxHeight).toBe(10);
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
  expect(machine.maxWidth).toBe(60);
  expect(machine.maxHeight).toBe(20);
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
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(30);
})

test("one line ends with pattern", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r", 10, 1000, 10, 5);
  expect(machine.output().length).toBe(2);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, "面包", true))
  expect(machine.maxWidth).toBe(70);
  expect(machine.maxHeight).toBe(10);
})

test("one line with pattern inside", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r，是这么一回事吗？", 10, 1000, 10, 5);
  expect(machine.output().length).toBe(3);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, "面包", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(70, 0, 90, 10, "，是这么一回事吗？", false))
  expect(machine.maxWidth).toBe(160);
  expect(machine.maxHeight).toBe(10);
})

test("serveral line with pattern inside", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r，是这么一回事吗？你知道吗？", 10, 80, 10, 5);
  expect(machine.output().length).toBe(5);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, "面包", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(70, 0, 10, 10, "，", false))
  expect(machine.output()[3]).toEqual(
    new DrawItem(0, 10, 80, 10, "是这么一回事吗？", false))
  expect(machine.output()[4]).toEqual(
    new DrawItem(0, 20, 50, 10, "你知道吗？", false))
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(30);
})

test("pattern was cut by lines", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f跳唱 rap 篮球，羽毛球，乒乓球\r, pattern 现在结束了", 10, 80, 10, 5);
  expect(machine.output().length).toBe(7);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 30, 10, "跳唱 r", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(0, 10, 75, 10, "ap 篮球，羽毛球", true))
  expect(machine.output()[3]).toEqual(
    new DrawItem(0, 20, 40, 10, "，乒乓球", true))
  expect(machine.output()[4]).toEqual(
    new DrawItem(40, 20, 10, 10, ", ", false))
  expect(machine.output()[5]).toEqual(
    new DrawItem(0, 30, 80, 10, "pattern 现在结束", false))
  expect(machine.output()[6]).toEqual(
    new DrawItem(0, 40, 10, 10, "了", false))
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(50);
})