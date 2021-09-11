
import QuestGoodsInfos from "../quest_goods_infos"

test("valid goods", () => {
  QuestGoodsInfos.init();
  let list = [
    QuestGoodsInfos.YanWine,
  ];
  list.forEach(info => {
    expect(info.name).not.toBe(undefined);
    expect(info.cost).toBeGreaterThan(0);
    expect(info.functional_text).not.toBe(undefined);
    expect(info.image).not.toBe(undefined);
  })
})