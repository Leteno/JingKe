
import {getEnumCases} from "../../misc/enum"
import {LabelAffectFactory, Label_Type} from "../label_affect"

test("crazy", () => {
  let types = getEnumCases(Label_Type) as Label_Type[];
  types.forEach(t => {
    let affect = LabelAffectFactory.getLabelAffect(
      t, "name", "desc");
    expect(affect).not.toBe(null);
    expect(affect.name).toBe("name");
    expect(affect.description).toBe("desc");
  });
})