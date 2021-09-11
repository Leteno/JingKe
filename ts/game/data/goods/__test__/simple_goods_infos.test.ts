
import SimpleGoodsInfos from "../simple_goods_infos"

test("valid goods", () => {
  SimpleGoodsInfos.init();
  let list = [
    SimpleGoodsInfos.LiuWeiWan,
    SimpleGoodsInfos.QinFlag,
  ];
  list.forEach(info => {
    expect(info.name).not.toBe(undefined);
    expect(info.cost).toBeGreaterThan(0);
    expect(info.functional_text).not.toBe(undefined);
    expect(info.image).not.toBe(undefined);
  })
})