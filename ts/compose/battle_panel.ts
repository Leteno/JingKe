import { ABILITY, Character } from "../data/character";
import Colors from "../game/data/styles/colors";
import TextEffects from "../game/data/styles/text_effects";
import { Align, LayoutType } from "../misc/layout";
import ImageView from "../widgets/imageview";
import LinearLayout, { Orientation } from "../widgets/linear_layout";
import Panel from "../widgets/panel";
import Sprite from "../widgets/sprite";
import TextView, { Text } from "../widgets/textview";

export class BattlePanel extends LinearLayout {
  ch1: Character;
  ch2: Character;
  onWin: () => void;
  onFail: () => void;
  onCancel: () => void;

  brief1: BattleBriefView;
  brief2: BattleBriefView;

  constructor() {
    super(Orientation.VERTICAL);
    this.padding.left = this.padding.right = this.padding.top = this.padding.bottom
      = 20;
    this.bgColor = Colors.winGrey;

    let panel = new Panel();
    panel.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.brief1 = new BattleBriefView();
    this.brief2 = new BattleBriefView();
    let vs = new TextView(new Text("\fvs\r").setDefaultEffect(TextEffects.labelEffect))
    vs.layoutParam.xcfg = Align.CENTER;
    vs.layoutParam.ycfg = Align.CENTER;
    vs.debug = true;
    this.brief2.layoutParam.xcfg = Align.END;
    panel.addView(this.brief1);
    panel.addView(vs);
    panel.addView(this.brief2);
    this.addView(panel);

    let button = new TextView(new Text("开始"));
    button.margin.top = 20;
    button.layoutParam.xcfg = Align.END;
    button.textColor = Colors.black;
    button.onclickInternal = (() => {
      this.visible = false;
      this.startBattle();
      return true;
    }).bind(this);
    this.addView(button);

    let cancelBtn = new TextView(new Text("取消"));
    cancelBtn.margin.top = 20;
    cancelBtn.layoutParam.xcfg = Align.END;
    cancelBtn.textColor = Colors.black;
    cancelBtn.onclickInternal = (() => {
      this.visible = false;
      if (this.onCancel) this.onCancel();
      return true;
    }).bind(this);
    this.addView(cancelBtn);

    this.visible = false;
  }

  show(ch1: Character, ch2: Character, onWin: ()=>void, onFail: ()=>void, onCancel: ()=>void) {
    this.visible = true;

    this.ch1 = ch1;
    this.ch2 = ch2;
    this.onWin = onWin;
    this.onFail = onFail;
    this.onCancel = onCancel;
    this.brief1.update(ch1);
    this.brief2.update(ch2);

    this.setIsDirty(true);
  }

  private startBattle() {
    // TODO
    let win = this.getAttack(this.ch1) > this.getAttack(this.ch2);
    if (win && this.onWin) {
      this.onWin();
    } else if (!win && this.onFail) {
      this.onFail();
    }
  }

  private getAttack(ch: Character) {
    return ch.abilities[ABILITY.ATTACK];
  }
}

class BattleBriefView extends LinearLayout {
  avatar: ImageView;
  attack: TextView;
  defend: TextView
  agile: TextView
  strength: TextView
  constructor() {
    super(Orientation.VERTICAL);
    this.avatar = new ImageView("");
    this.avatar.forceWidth = this.avatar.forceHeight = 100;
    this.avatar.margin.bottom = 10;
    this.attack = this.createTextView()
    this.defend = this.createTextView()
    this.agile = this.createTextView()
    this.strength = this.createTextView()
    this.addView(this.avatar);
    this.addView(this.strength)
    this.addView(this.attack);
    this.addView(this.defend)
    this.addView(this.agile)
  }

  createTextView() {
    let ret = new TextView();
    ret.textSize = 24;
    ret.textColor = Colors.black;
    return ret;
  }

  update(ch:Character) {
    this.avatar.img.src = ch.imageSrc;
    this.strength.setText(new Text("体力: " + ch.abilities[ABILITY.STRENGTH]));
    this.attack.setText(new Text("勇武: " + ch.abilities[ABILITY.ATTACK]));
    this.defend.setText(new Text("防御: " + ch.abilities[ABILITY.DEFEND]));
    this.agile.setText(new Text("灵敏: " + ch.abilities[ABILITY.AGILE]));
  }
}