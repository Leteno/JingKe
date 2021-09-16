
import TextViewStateMachine from "../textview_state_machine"
import {DrawItem} from "../textview_state_machine"

test("normal", () => {
  let machine = new TextViewStateMachine();
  machine.parse("Hello world, 郑", 10, 100, 10, 1);
  expect(machine.output().length).toBe(1)
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 23, 10, 0, 13, "Hello world, 郑", false)
  )
  expect(machine.maxWidth).toBe(23);
  expect(machine.maxHeight).toBe(10);
})

test("two line", () => {
  let machine = new TextViewStateMachine();
  machine.parse("恭喜发财，红包拿来", 10, 60, 10, 1);
  expect(machine.output().length).toBe(2);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 60, 10, 0, 5, "恭喜发财，红", false)
  )
  expect(machine.output()[1]).toEqual(
    new DrawItem(0, 10, 30, 10, 6, 8, "包拿来", false)
  )
  expect(machine.maxWidth).toBe(60);
  expect(machine.maxHeight).toBe(20);
})

test("two line, first line ends with english words", () => {
  let machine = new TextViewStateMachine();
  machine.parse("张先生 Good Morning 啊，吃点早餐把", 10, 80, 10, 5);
  expect(machine.output().length).toBe(3);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 60, 10, 0, 8, "张先生 Good ", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(0, 10, 80, 10, 9, 20, "Morning 啊，吃点", false))
  expect(machine.output()[2]).toEqual(
    new DrawItem(0, 20, 30, 10, 21, 23, "早餐把", false))
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(30);
})

test("one line ends with pattern", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r", 10, 1000, 10, 5);
  expect(machine.output().length).toBe(2);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, 0, 4, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, 6, 7, "面包", true))
  expect(machine.maxWidth).toBe(70);
  expect(machine.maxHeight).toBe(10);
})

test("one line with pattern inside", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r，是这么一回事吗？", 10, 1000, 10, 5);
  expect(machine.output().length).toBe(3);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, 0, 4, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, 6, 7, "面包", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(70, 0, 90, 10, 9, 17, "，是这么一回事吗？", false))
  expect(machine.maxWidth).toBe(160);
  expect(machine.maxHeight).toBe(10);
})

test("serveral line with pattern inside", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f面包\r，是这么一回事吗？你知道吗？", 10, 80, 10, 5);
  expect(machine.output().length).toBe(5);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, 0, 4, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 20, 10, 6, 7, "面包", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(70, 0, 10, 10, 9, 9, "，", false))
  expect(machine.output()[3]).toEqual(
    new DrawItem(0, 10, 80, 10, 10, 17, "是这么一回事吗？", false))
  expect(machine.output()[4]).toEqual(
    new DrawItem(0, 20, 50, 10, 18, 22, "你知道吗？", false))
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(30);
})

test("pattern was cut by lines", () => {
  let machine = new TextViewStateMachine();
  machine.parse("刘小姐喜欢\f跳唱 rap 篮球，羽毛球，乒乓球\r, pattern 现在结束了", 10, 80, 10, 5);
  expect(machine.output().length).toBe(7);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 50, 10, 0, 4, "刘小姐喜欢", false))
  expect(machine.output()[1]).toEqual(
    new DrawItem(50, 0, 30, 10, 6, 9, "跳唱 r", true))
  expect(machine.output()[2]).toEqual(
    new DrawItem(0, 10, 75, 10, 10, 18, "ap 篮球，羽毛球", true))
  expect(machine.output()[3]).toEqual(
    new DrawItem(0, 20, 40, 10, 19, 22, "，乒乓球", true))
  expect(machine.output()[4]).toEqual(
    new DrawItem(40, 20, 10, 10, 24, 25, ", ", false))
  expect(machine.output()[5]).toEqual(
    new DrawItem(0, 30, 80, 10, 26, 37, "pattern 现在结束", false))
  expect(machine.output()[6]).toEqual(
    new DrawItem(0, 40, 10, 10, 38, 38, "了", false))
  expect(machine.maxWidth).toBe(80);
  expect(machine.maxHeight).toBe(50);
})

test("text with \n", () => {
  let machine = new TextViewStateMachine();
  machine.parse("我说话很喜欢换行\n你看\n又换一行\n不是", 10, 1000, 10, 5);
  expect(machine.output().length).toEqual(4);
  expect(machine.output()[0]).toEqual(
    new DrawItem(0, 0, 80, 10, 0, 7, "我说话很喜欢换行", false)
  )
  expect(machine.output()[1]).toEqual(
    new DrawItem(0, 10, 20, 10, 9, 10, "你看", false)
  )
  expect(machine.output()[2]).toEqual(
    new DrawItem(0, 20, 40, 10, 12, 15, "又换一行", false)
  )
  expect(machine.output()[3]).toEqual(
    new DrawItem(0, 30, 20, 10, 17, 18, "不是", false)
  )
  expect(machine.maxWidth).toBe(1000);
  expect(machine.maxHeight).toEqual(40);
})