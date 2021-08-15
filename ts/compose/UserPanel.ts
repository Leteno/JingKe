import { Character } from "../data/character";
import Main from "../main";
import { Align, LayoutType } from "../misc/layout";
import TextView from "../widgets/textview";
import {Text} from "../widgets/textview";
import { PageList } from "./page_list";
import PlayerDescriptionView from "./player_description_view";

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
    this.descriptionView.margin.left = 40;
    this.descriptionView.margin.right = 40;
    this.addPage("状态", this.descriptionView);
    let otherPage = new TextView(new Text("Hello world"));
    this.addPage("其他", otherPage);

    this.descriptionView.bindData(Main.getPlayer().character,
      (v: PlayerDescriptionView, d: Character) => {
      v.setCharacter(d);
    });

    this.bgColor = "#ff0000";
  }
}