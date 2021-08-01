import Animator from "./animator";

export class MeanWhile implements Animator<number> {
  animateList: Array<Animator<number>>;
  constructor(animateList: Array<Animator<number>>) {
    this.animateList = animateList;
  }

  update(dt: number): number {
    let restOfDt = dt;
    this.animateList.forEach(animator => {
      if (!animator.isStop()) {
        let rest = animator.update(dt);
        restOfDt = Math.min(rest, restOfDt);
      }
    })
    return restOfDt;
  }

  getVal(): number {
    let count = 0;
    this.animateList.forEach(animator => {
      if (animator.isStop()) {
        count++;
      }
    })
    return count;
  }
  isStop(): boolean {
    return this.getVal() == this.animateList.length;
  }
  onValChange(val: number) {
  }
  onStop() {
  }
}

export class MeanWhileBuilder {
  animators: Array<Animator<number>>;

  constructor() {
    this.animators = new Array<Animator<number>>()
  }

  join(animator: Animator<number>): MeanWhileBuilder {
    this.animators.push(animator);
    return this;
  }

  build(): MeanWhile {
    return new MeanWhile(this.animators);
  }
}