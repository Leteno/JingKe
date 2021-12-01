import { BindableData } from "../data/bindable_data";
import { ABILITY, Character } from "../data/character";
import Colors from "../game/data/styles/colors";
import TextEffects from "../game/data/styles/text_effects";
import { Align, LayoutType } from "../misc/layout";
import AddRemoveView from "../widgets/add_remove_view";
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
    button.layoutParam.xcfg = Align.CENTER;
    button.textColor = Colors.black;
    button.onclickInternal = (() => {
      this.visible = false;
      this.startBattle();
      return true;
    }).bind(this);
    this.addView(button);

    let cancelBtn = new TextView(new Text("取消"));
    cancelBtn.margin.top = 20;
    cancelBtn.layoutParam.xcfg = Align.CENTER;
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
    this.brief1.bind(ch1);
    this.brief2.bind(ch2);
    this.brief2.showCompound(false);

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
  attack: CompoundView;
  defend: CompoundView
  agile: CompoundView
  strength: CompoundView
  point: TextView

  model: BriefModel;
  constructor() {
    super(Orientation.VERTICAL);
    this.model = new BriefModel();

    this.avatar = new ImageView("");
    this.avatar.forceWidth = this.avatar.forceHeight = 100;
    this.avatar.margin.bottom = 10;
    this.attack = new CompoundView("勇武", this.model)
    this.defend = new CompoundView("防御", this.model)
    this.agile = new CompoundView("灵敏", this.model)
    this.strength = new CompoundView("体力", this.model)
    this.point = new TextView()
    this.addView(this.avatar);
    this.addView(this.strength)
    this.addView(this.attack);
    this.addView(this.defend)
    this.addView(this.agile)
    this.addView(this.point)

    this.point.textSize = 24;
    this.point.textColor = Colors.black;

    this.bindData(this.model, BattleBriefView.update);
  }

  bind(ch:Character) {
    this.avatar.img.src = ch.imageSrc;
    this.strength.setOriginal(ch.abilities[ABILITY.STRENGTH]);
    this.attack.setOriginal(ch.abilities[ABILITY.ATTACK]);
    this.defend.setOriginal(ch.abilities[ABILITY.DEFEND]);
    this.agile.setOriginal(ch.abilities[ABILITY.AGILE]);
    this.model.leftPoints = ch.abilities[ABILITY.POINT];
    this.model.dirty = true;
  }

  showCompound(show: boolean) {
    let compounds = [this.attack, this.defend, this.agile, this.strength]
    for (let i in compounds) {
      compounds[i].addRemove.visible = show;
    }
  }

  static update(v: BattleBriefView, d: BriefModel) {
    v.point.setText(new Text(`可用点数: ${d.leftPoints}`))
  }
}

class BriefModel extends BindableData {
  leftPoints: number
}

class CompoundView extends LinearLayout {
  text: TextView
  addRemove: AddRemoveView
  caption: string
  minNumber: number
  addNumber: number

  model: BriefModel;

  constructor(caption: string, m: BriefModel) {
    super(Orientation.HORIZONTAL);
    this.caption = caption;
    this.minNumber = 0;
    this.addNumber = 0;
    this.model = m;

    this.text = this.createTextView();
    this.addRemove = this.createAddRemoveView();
    this.addView(this.text);
    this.addView(this.addRemove);
  }

  private createTextView() {
    let ret = new TextView();
    ret.textSize = 24;
    ret.textColor = Colors.black;
    return ret;
  }

  private createAddRemoveView() {
    let ret = new AddRemoveView();
    ret.forceWidth = 48;
    ret.forceHeight = 24;
    ret.setOnClick(
      ()=>{
        if (this.model.leftPoints > 0) {
          this.model.leftPoints -= 1;
          this.model.dirty = true;
          this.addNumber += 1;
          this.updateText();
        }
      },  // Add fn
      ()=>{
        if (this.addNumber > 0) {
          this.addNumber -= 1;
          this.model.leftPoints += 1;
          this.model.dirty = true;
          this.updateText();
        }
      }   // Remove fn
    );
    return ret;
  }

  setOriginal(data: number) {
    this.minNumber = data;
    this.updateText();
  }

  updateText() {
    this.text.setText(new Text(`${this.caption}: ${this.minNumber + this.addNumber}`))
  }
}