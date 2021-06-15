import Animator from "./animator"

export default class NumberLinearAnimator implements Animator<number> {
  start: number
  end: number
  feet: number
  stop: boolean

  constructor(start: number, end: number, feet?: number) {
    if (feet === undefined) {
      feet = start > end ? -1 : 1;
    }
    this.start = start;
    this.end = end;
    this.feet = feet;
    this.stop = false;
  }
  isStop(): boolean {
    return this.stop;
  }
  onStop() {
  }

  update() {
    if (this.stop) return;
    this.start += this.feet;
    if (this.feet > 0) {
      if (this.start > this.end) {
        this.start = this.end;
      }
    } else {
      if (this.start < this.end) {
        this.start = this.end;
      }
    }
    if (this.start === this.end) {
      this.stop = true;
      this.onStop();
    }
  }
  getVal(): number {
    return this.start;
  }

}