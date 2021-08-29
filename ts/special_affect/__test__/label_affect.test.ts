
import {getEnumCases} from "../../misc/enum"
import {LabelAffectFactory, Label_Type} from "../label_affect"



test("crazy", () => {
  let types = getEnumCases(Label_Type) as Label_Type[];
  let expects = new Map<Label_Type, {name: string, desc: string}>();
  expects.set(Label_Type.Brave, {
    name: "勇敢",
    desc: "遇到攻击力比自己高的，攻击力+3",
  })
  expects.set(Label_Type.Xianting, {
    name: "闲庭",
    desc: "由于你的步伐过于冷静，正常情况下不会遭遇捕快",
  })
  expects.set(Label_Type.Yiboyuntian, {
    name: "义薄云天",
    desc: "任何义士遇到困难，你都会伸出援手",
  })

  types.forEach(t => {
    let affect = LabelAffectFactory.getLabelAffect(t);
    expect(affect).not.toBe(null);
    expect(expects.get(t)).not.toBe(undefined);
    let item = expects.get(t) as {
      name: string,
      desc: string
    }
    expect(affect.name).toBe(item.name);
    expect(affect.description).toBe(item.desc);
  });
})