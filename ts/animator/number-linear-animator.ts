import Animator from "./animator"

export default class NumberLinearAnimator implements Animator<number> {
  start: number
  end: number
  totalTime: number
  feet: number
  stop: boolean

  constructor(start: number, end: number, totalTime: number) {
    this.start = start;
    this.end = end;
    this.totalTime = totalTime;
    if (totalTime > 0) {
      this.feet = (end - start) / totalTime;
    } else {
      this.feet = end - start;
    }
    this.stop = false;
  }
  isStop(): boolean {
    return this.stop;
  }
  onStop() {
  }

  update(dt: number) {
    if (this.stop) return;
    this.start += this.feet * dt;
    if (this.feet > 0) {
      if (this.start > this.end) {
        this.start = this.end;
      }
    } else {
      if (this.start < this.end) {
        this.start = this.end;
      }
    }
    this.onValChange(this.start);
    if (this.start === this.end) {
      this.stop = true;
      this.onStop();
    }
  }
  getVal(): number {
    return this.start;
  }
  onValChange(val: number) {}
}