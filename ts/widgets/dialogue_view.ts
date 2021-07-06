import DualStateInfiniteAnimator from "../animator/dual-state-infinite-animator"
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

  showHint: boolean;
  hintAnimator: DualStateInfiniteAnimator;

  queue: Array<Dialogue>;

  debug: boolean;

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
    this.visible = false;

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
    this.hintAnimator = new DualStateInfiniteAnimator(
      500, false
    );

    // Others
    this.expectedContentText = "你好，冒险者";
    this.queue = new Array<Dialogue>();
    this.debug = false;
    this.showHint = false;
  }

  drawToCanvasInternal(
    ctx: CanvasRenderingContext2D, x: number, y: number) : void {

    if (this.debug) {
      ctx.save();
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.x, this.y,
      this.width - this.getLandscapeMargin(),
      this.height - this.getPortraitMargin());
    ctx.restore();

    if (this.showHint && this.hintAnimator.getVal()) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.translate(
        this.x + this.width - this.getLandscapeMargin() - 40,
        this.y + this.height - this.getPortraitMargin() - 40);
      ctx.ellipse(20, 20, 5, 5, 0, 0, 360);
      ctx.stroke();
      ctx.restore();
    }

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
        })) != -1) {
      let top = this.queue.shift();
      this.updateView(top);
    }
  }

  private updateView(data:Dialogue) {
    this.visible = true;
    this.showHint = false;
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
    contentAnimator.onStop = (() => {
      this.showHint = true;
      this.onContentLoadCompleted();
    }).bind(this);
    this.animators.push(contentAnimator);
  }

  updateTime(dt:number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    })
    this.hintAnimator.update(dt);
  }

  onContentLoadCompleted() {
  }

  onclickInternal(event: ClickEvent) {
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
        this.visible = false;
      }
    }
    return true;
  }
}