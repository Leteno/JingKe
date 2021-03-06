
import { Player } from "../../data/player";
import { Goods } from "../../data/goods";
import { ClickEvent, DragEvent, PressEvent } from "../../misc/event";
import { Specify } from "../../misc/layout";
import { GoodsAffect, GoodsAffectFactory, Goods_Type } from "../../special_affect/goods_affect";
import Panel from "../../widgets/panel";
import TextView from "../../widgets/textview";
import { defaultCtx } from "../../widgets/__test__/default_value.test";
import GoodsPanel, { GoodsPanelModel } from "../goods_panel"
import SimpleGoodsInfos from "../../game/data/goods/simple_goods_infos";

function buildModelForTest(): GoodsPanelModel {
  SimpleGoodsInfos.init();
  let model = new GoodsPanelModel();
  let p1 = new Goods(SimpleGoodsInfos.LiuWeiWan, 10);
  let p2 = new Goods(SimpleGoodsInfos.QinFlag, 1);
  for (let i = 0; i < 100; i++)
    model.goodsList.push(p1, p2);
  return model;
}

function getGoodsListTextView(
  panel: GoodsPanel, index: number): TextView {
  expect(index).toBeLessThan(panel.goodsList.children.length);
  expect(index).toBeGreaterThanOrEqual(0);
  return (panel.goodsList.children[index] as Panel).children[0] as TextView;
}

test("simple case", () => {
  let goodsPanel = new GoodsPanel();

  let model = buildModelForTest();

  goodsPanel.bindModel(model);
  expect(goodsPanel.description.visible)
    .toBe(false);
  expect(goodsPanel.goodsList.children.length)
    .toBe(200);
  expect(getGoodsListTextView(goodsPanel, 0)
    .text.content).toBe("六味补气丸");
  expect(getGoodsListTextView(goodsPanel, 1)
    .text.content).toBe("秦国军旗");

  goodsPanel.description.update(model.goodsList[1]);
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
  goodsPanel.description.update(model.goodsList[0]);
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

  goodsPanel.scrollView.ondragInternal(
    new DragEvent(0, 0, 10, -10, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(-10);
  goodsPanel.scrollView.ondragInternal(
    new DragEvent(0, 0, 10, -20, 0));
  expect(goodsPanel.scrollView.offsetY)
    .toBe(-20);
})

test("goods affect", () => {
  let goodsPanel = new GoodsPanel();

  let model = buildModelForTest();

  goodsPanel.bindModel(model);
  // So that when changed bindedData, the onBind
  // will be invoked in drawToCanvas()
  goodsPanel.description.visible = true;

  Player.getInstance().character.specials = [];
  goodsPanel.description.update(model.goodsList[1]);
  goodsPanel.description.drawToCanvas(defaultCtx);
  expect(goodsPanel.description.costLabel.text.content).toBe("需 100 金");

  Player.getInstance().character.specials.push(
    GoodsAffectFactory.getGoodsAffect(
      Goods_Type.GACostDiscount, "", "", 0.7
    ) as GoodsAffect
  );
  goodsPanel.description.update(model.goodsList[1]);
  goodsPanel.description.drawToCanvas(defaultCtx);
  expect(goodsPanel.description.costLabel.text.content).toBe("需 70(-30) 金");

  Player.getInstance().character.specials.push(
    GoodsAffectFactory.getGoodsAffect(
      Goods_Type.GACostDiscount, "", "", 7
    ) as GoodsAffect
  );
  goodsPanel.description.update(model.goodsList[1]);
  goodsPanel.description.drawToCanvas(defaultCtx);
  expect(goodsPanel.description.costLabel.text.content).toBe("需 490(+390) 金");
})