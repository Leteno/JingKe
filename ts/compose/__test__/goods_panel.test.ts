
import { Prossession } from "../../data/prossession";
import { ClickEvent, PressEvent } from "../../misc/event";
import { Specify } from "../../misc/layout";
import TextView from "../../widgets/textview";
import { defaultCtx } from "../../widgets/__test__/default_value.test";
import GoodsPanel, { GoodsPanelModel } from "../goods_panel"

function buildModelForTest(): GoodsPanelModel {
  let model = new GoodsPanelModel();
  let p1 = new Prossession();
  p1.name = "六味补气丸";
  p1.count = 10;
  p1.functional = "益气活血，祛痰化瘀";
  let p2 = new Prossession();
  p2.name = "秦国军旗";
  p2.count = 1;
  p2.functional = "赳赳大秦，一往无前";
  for (let i = 0; i < 100; i++)
    model.goodsList.push(p1, p2);
  return model;
}

test("simple case", () => {
  let goodsPanel = new GoodsPanel();

  let model = buildModelForTest();

  goodsPanel.bindModel(model);
  expect(goodsPanel.description.visible)
    .toBe(false);
  expect(goodsPanel.goodsList.children.length)
    .toBe(200);
  expect((goodsPanel.goodsList.children[0] as TextView)
    .text.content).toBe("六味补气丸");
  expect((goodsPanel.goodsList.children[1] as TextView)
    .text.content).toBe("秦国军旗");

  goodsPanel.description.bind(model.goodsList[1]);
  expect(goodsPanel.description.title.text.content)
    .toBe("秦国军旗")
  expect(goodsPanel.description.content.text.content)
    .toBe("赳赳大秦，一往无前");
  expect(goodsPanel.description.left.text.content)
    .toBe("剩余: 1");
})

test("click", () => {
  let goodsPanel = new GoodsPanel();

  let model = buildModelForTest();

  goodsPanel.bindModel(model);
  goodsPanel.measure(defaultCtx, 400, 400, Specify.NONE);
  goodsPanel.layout(400, 400);
  expect(goodsPanel.description.visible)
    .toBe(false);
  expect(model.dirty).toBe(false);
  expect(model.currentIndex).toBe(-1);

  goodsPanel.goodsList.onclick(new ClickEvent(0, 0));
  expect(model.currentIndex).toBe(0);
  expect(model.dirty).toBe(true);
  goodsPanel.description.bind(model.goodsList[0]);
  expect(goodsPanel.description.title.text.content)
    .toBe("六味补气丸");
  expect(goodsPanel.description.content.text.content)
    .toBe("益气活血，祛痰化瘀");
  expect(goodsPanel.description.left.text.content)
    .toBe("剩余: 10");
})

test("scroll", () => {
  let goodsPanel = new GoodsPanel();

  let model = buildModelForTest();

  goodsPanel.bindModel(model);
  goodsPanel.measure(defaultCtx, 400, 400, Specify.NONE);
  goodsPanel.layout(400, 400);

  expect(goodsPanel.scrollView.offsetY)
    .toBe(0);

  goodsPanel.goodsUpBtn.onclickInternal(new ClickEvent(0, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(-10);
  goodsPanel.goodsUpBtn.onpressInternal(new PressEvent(0, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(-20);

  goodsPanel.goodsDownBtn.onclickInternal(new ClickEvent(0, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(-10);
  goodsPanel.goodsDownBtn.onpressInternal(new PressEvent(0, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(0);
})