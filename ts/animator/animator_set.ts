import Animator from "./animator";
import NumberLinearAnimator from "./number-linear-animator";

export class AnimatorSet implements Animator<number> {
  animationList: Array<Animator<number>>;
  currentIdx: number;
  constructor(aList: Array<Animator<number>>) {
    this.animationList = aList;
    this.currentIdx = 0;
  }

  update(dt: number) : number {
    if (this.isStop()) return;
    let restOfDt = dt;
    while (restOfDt > 0 && !this.isStop()) {
      let currentAnimator = this.animationList[this.currentIdx];
      restOfDt = currentAnimator.update(restOfDt);
      if (currentAnimator.isStop()) {
        this.currentIdx ++;
      }
    }
    if (this.isStop()) {
      this.onStop();
    }
    return restOfDt;
  }

  getVal(): number {
    return this.currentIdx;
  }

  isStop(): boolean {
    return this.currentIdx == this.animationList.length;
  }

  onValChange(val: number) {
  }
  onStop() {
  }
}

export class AnimatorSetBuilder {
  animations: Array<Animator<number>>;

  constructor() {
    this.animations = new Array<Animator<number>>();
  }

  after(animator: Animator<number>): AnimatorSetBuilder {
    this.animations.push(animator);
    return this;
  }

  build(): AnimatorSet {
    return new AnimatorSet(this.animations);
  }
}