import { Character } from "../data/character";
import { Prossession } from "../data/prossession";
import Main from "../main";
import { Align, LayoutType } from "../misc/layout";
import TextView from "../widgets/textview";
import {Text} from "../widgets/textview";
import { PageList } from "./page_list";
import PlayerDescriptionView from "./player_description_view";
import { UserProssessionView } from "./user_prossession_view";

export default class UserPanel extends PageList {

  descriptionView: PlayerDescriptionView;
  constructor() {
    super();

    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.layoutParam.xcfg = this.layoutParam.ycfg
      = Align.CENTER;
    this.margin.left = this.margin.right = 40;

    this.descriptionView = new PlayerDescriptionView();
    this.descriptionView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.descriptionView.layoutParam.xcfg = Align.CENTER;
    this.descriptionView.layoutParam.ycfg = Align.CENTER;
    this.addPage("状态", this.descriptionView);
    let prossessionPage = new UserProssessionView();
    prossessionPage.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    let p1 = new Prossession();
    p1.name = "六味补气丹";
    p1.count = 1;
    p1.functional_text = "治疗肾虚，你懂的";
    let p2 = new Prossession();
    p2.name = "大力金刚丸";
    p1.count = 999;
    p1.functional_text = "听说吃了会很大力";
    for (let i = 0; i < 100; i++)
      prossessionPage.model.items.push(p1, p2);
    prossessionPage.model.dirty = true;
    this.addPage("物品", prossessionPage);

    this.descriptionView.bindData(Main.getPlayer().character,
      (v: PlayerDescriptionView, d: Character) => {
      v.setCharacter(d);
    });

    this.descriptionView.bgColor = undefined;
    this.bgColor = "#e6e6e6";
  }

  onTouchOutside() {
    if (!this.visible) {
      return false;
    }
    this.visible = false;
    return true;
  }
}