import NumberLinearAnimator from "../animator/number-linear-animator";
import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Panel from "./panel";
import TextView from "./textview";

export default class DialogueView extends Panel {
  nameViewLeft: TextView;
  nameViewRight: TextView;
  contentView: TextView;
  animators: Array<NumberLinearAnimator>;

  queue: Array<Dialogue>;

  // Hack to update contentView's text
  expectedContentText: string;

  constructor() {
    super();

    this.layoutParam = new LayoutParams(
      Align.START, Align.END
    );
    this.left = 20;
    this.right = 20;
    this.bottom = 20;

    // Add all views:
    this.nameViewLeft = new TextView("郑大侠");
    this.nameViewRight = new TextView("嘉女士");
    this.contentView = new TextView("你好，冒险者");
    this.addView(this.nameViewLeft);
    this.addView(this.nameViewRight);
    this.addView(this.contentView);

    // Configure View position
    this.nameViewLeft.left = 20;
    this.nameViewLeft.top = 10;
    this.nameViewRight.right = 60;
    this.nameViewRight.top = 10;
    this.nameViewRight.layoutParam = new LayoutParams(
      Align.END, Align.START
    );
    this.nameViewRight.visible = false;
    this.contentView.left = 20;
    this.contentView.right = 50;
    this.contentView.top = 40;
    this.contentView.bottom = 20;
    this.contentView.textSize = 16;

    // Animator
    this.animators = new Array<NumberLinearAnimator>();

    // Others
    this.expectedContentText = "你好，冒险者";
    this.queue = new Array<Dialogue>();
  }

  drawToCanvasInternal(
    ctx: CanvasRenderingContext2D, x: number, y: number) : void {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.x, this.y,
      this.width - this.getLandscapeMargin(),
      this.height - this.getPortraitMargin());
    ctx.restore();

    if (this.expectedContentText != this.contentView.text) {
      this.contentView.text = this.expectedContentText;
      this.measure(
        ctx,
        this.width - this.getLandscapeMargin(),
        this.height - this.getPortraitMargin());
    }
    super.drawToCanvasInternal(ctx, x, y);
  }

  addDialogue(data: Dialogue) {
    this.queue.push(data);
    if (this.animators.length == 0 ||
        this.animators.findIndex((animator=> {
          return animator.isStop();
        }))) {
      let top = this.queue.slice(0, 1)[0];
      this.updateView(top);
    }
  }

  private updateView(data:Dialogue) {
    let view = data.showAtLeft ? this.nameViewLeft
                : this.nameViewRight;
    view.text = data.username;

    this.animators.splice(0);
    let supposedTime = data.content.length * 1000 / data.speed;
    let contentAnimator = new NumberLinearAnimator(
      0, data.content.length, supposedTime
    );
    contentAnimator.onValChange = (val => {
      this.expectedContentText =
        data.content.substr(0, val);
    }).bind(this);
    contentAnimator.onStop =
      this.onContentLoadCompleted.bind(this);
    this.animators.push(contentAnimator);
  }

  updateTime(dt:number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    })
  }

  onContentLoadCompleted() {
    console.log("onContentLoadComplete");
  }

  onclickInternal(event: ClickEvent) {
    if (this.animators.length > 0 &&
        this.animators.findIndex((animator) => {
          return !animator.isStop();
        })) {
      // click to skip the animation.
      this.animators.forEach((animator) => {
        animator.update(animator.totalTime);
      })
    } else {
      // click to update data:
      if (this.queue.length > 0) {
        let front = this.queue.slice(0,1)[0];
        this.updateView(front);
      }
    }
    return true;
  }
}