import NumberLinearAnimator from "../animator/number-linear-animator";
import { Character } from "../data/character";
import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams, LayoutType } from "../misc/layout";
import ImageView from "./imageview";
import LinearLayout, { Orientation } from "./linear_layout";
import Panel from "./panel";
import { Border } from "./sprite";
import TextView, { Text } from "./textview";

export default class DialogueView extends Panel {
  avatarLayer: AvatarLayer;
  nameViewLeft: TextView;
  nameViewRight: TextView;
  contentView: TextView;
  animators: Array<NumberLinearAnimator>;
  queue: Array<Dialogue>;

  constructor() {
    super();

    this.layoutParam = new LayoutParams(
      Align.START, Align.END
    );
    this.visible = false;
    this.border = new Border();
    this.debugColor = "green";

    // Configure View position
    this.padding.left = 20;
    this.padding.top = 10;
    this.padding.right = 20;
    this.padding.bottom = 20;

    // Add all views:
    this.nameViewLeft = new TextView(new Text("郑大侠"));
    this.nameViewRight = new TextView(new Text("嘉女士"));
    this.contentView = new TextView(new Text("你好，冒险者"));
    this.nameViewLeft.textColor = "black";
    this.nameViewRight.textColor = "black";
    this.contentView.textColor = "black";
    this.addView(this.nameViewLeft);
    this.addView(this.nameViewRight);
    this.addView(this.contentView);

    this.nameViewRight.layoutParam = new LayoutParams(
      Align.END, Align.START
    );
    this.nameViewRight.visible = false;
    this.contentView.margin.top = 40;
    this.contentView.margin.bottom = 20;
    this.contentView.textSize = 16;

    this.avatarLayer = new AvatarLayer();
    this.avatarLayer.margin.top =
      -100 - this.padding.top;
    this.avatarLayer.margin.left = - this.padding.left;
    this.avatarLayer.margin.right = - this.padding.right;
    this.addView(this.avatarLayer);

    // Animator
    this.animators = new Array<NumberLinearAnimator>();

    // Others
    this.queue = new Array<Dialogue>();
  }

  addDialogue(data: Dialogue) {
    this.queue.push(data);
    if (this.animators.length == 0 ||
        this.animators.findIndex((animator=> {
          return animator.isStop();
        })) != -1) {
      let top = this.queue.shift();
      this.updateView(top);
    }
  }

  private updateView(data:Dialogue) {
    this.visible = true;
    let nameView = data.showAtLeft ? this.nameViewLeft
                : this.nameViewRight;
    nameView.setText(new Text(data.character.name));
    nameView.visible = true;
    let otherView = data.showAtLeft ? this.nameViewRight
                : this.nameViewLeft;
    otherView.visible = false;

    this.animators.splice(0);
    let supposedTime = data.content.content.length * 1000 / data.speed;
    let contentAnimator = new NumberLinearAnimator(
      0, data.content.content.length, supposedTime
    );
    this.contentView.setText(data.content);
    this.contentView.showTextLength = 0;

    this.avatarLayer.updateAvatar(data.character, data.showAtLeft);

    this.contentView.setIsDirty(true);
    nameView.setIsDirty(true);
    otherView.setIsDirty(true);

    contentAnimator.onValChange = (val => {
      this.contentView.showTextLength = Math.floor(val);
    }).bind(this);
    contentAnimator.onStop = (() => {
      this.onContentLoadCompleted();
    }).bind(this);
    this.animators.push(contentAnimator);
  }

  updateTime(dt:number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    })
  }

  onContentLoadCompleted() {
  }

  onclickInternal(event: ClickEvent) {
    this.performNext();
    return true;
  }

  onTouchOutside() {
    if (this.visible) {
      // Please answer dialogue view before you move on.
      this.performNext();
      return true;
    }
    return false;
  }

  performNext() {
    if (this.animators.length > 0 &&
      this.animators.findIndex((animator) => {
        return !animator.isStop();
      }) != -1) {
      // click to skip the animation.
      this.animators.forEach((animator) => {
        animator.update(animator.totalTime);
      })
    } else {
      // click to update data:
      if (this.queue.length > 0) {
        let front = this.queue.shift();
        this.updateView(front);
      } else {
        if (this.onDialogueFinished) {
          let callback = this.onDialogueFinished;
          this.onDialogueFinished = undefined;
          callback();
        }
      }
    }
  }

  // Call when no more dialogue follow up
  // Will call once.
  onDialogueFinished() {
  }

  hide() {
    this.avatarLayer.reset();
    this.visible = false;
  }
}

class AvatarLayer extends LinearLayout {
  avatarsLeft: ImageView;
  emptyPlaceHolder: Panel;
  avatarsRight: ImageView;

  constructor() {
    super(Orientation.HORIZONTAL);
    this.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    this.avatarsLeft = new ImageView("res/copyleft/people_juzi.png");
    this.avatarsRight = new ImageView("res/copyleft/people_fanwuji.png");
    this.avatarsLeft.forceWidth = this.avatarsLeft.forceHeight =
      this.avatarsRight.forceWidth = this.avatarsRight.forceHeight = 100;
    this.emptyPlaceHolder = new Panel();
    this.emptyPlaceHolder.layoutParam.weight = 1;
    this.addView(this.avatarsLeft);
    this.addView(this.emptyPlaceHolder);
    this.addView(this.avatarsRight);

    this.avatarsLeft.visible = false;
    this.avatarsRight.visible = false;
  }

  updateAvatar(character: Character, showAtLeft: boolean) {
    let avatar = showAtLeft ? this.avatarsLeft
                            : this.avatarsRight;
    let opposite = showAtLeft ? this.avatarsRight
                              : this.avatarsLeft;
    avatar.img.src = character.imageSrc;
    avatar.visible = true;
    opposite.visible = false;
  }

  // reset avatar views to be hidden
  reset() {
    this.avatarsLeft.visible = false;
    this.avatarsRight.visible = false;
  }
}