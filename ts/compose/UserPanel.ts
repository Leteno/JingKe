import { Character } from "../data/character";
import { Player } from "../data/player";
import { Goods } from "../data/goods";
import { Align, LayoutType } from "../misc/layout";
import { PageList } from "./page_list";
import PlayerDescriptionView from "./player_description_view";
import { QuestPanel } from "./quest_panel";
import { UserGoodsView } from "./user_goods_view";

export default class UserPanel extends PageList {

  descriptionView: PlayerDescriptionView;
  prossessionPage: UserGoodsView;
  questPanel: QuestPanel;
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

    this.prossessionPage = new UserGoodsView();
    this.prossessionPage.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.addPage("物品", this.prossessionPage);

    this.questPanel = new QuestPanel();
    this.addPage("任务", this.questPanel);

    this.descriptionView.bgColor = undefined;
    this.bgColor = "#e6e6e6";
  }

  updateCharacter(character: Character) {
    this.descriptionView.setCharacter(character);
    this.prossessionPage.model.items = Player.instance.possessions;
    this.prossessionPage.model.dirty = true;
    this.questPanel.update(Player.instance.quests);
  }

  onTouchOutside() {
    if (!this.visible) {
      return false;
    }
    this.visible = false;
    return true;
  }
}