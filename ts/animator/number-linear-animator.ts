import Animator from "./animator"

export default class NumberLinearAnimator implements Animator<number> {
  originalStart: number
  current: number
  end: number
  totalTime: number
  feet: number
  stop: boolean

  constructor(start: number, end: number, totalTime: number) {
    this.originalStart = start;
    this.current = start;
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

  update(dt: number): number {
    if (this.stop) return;
    this.current += this.feet * dt;
    let restOfDt = 0;
    if (this.feet > 0) {
      if (this.current > this.end) {
        restOfDt = this.current - this.end;
        this.current = this.end;
      }
    } else {
      if (this.current < this.end) {
        this.current = this.end;
      }
    }
    this.onValChange(this.current);
    if (this.current === this.end) {
      this.stop = true;
      this.onStop();
    }
    return restOfDt;
  }
  getVal(): number {
    return this.current;
  }
  onValChange(val: number) {}

  reverse() : NumberLinearAnimator {
    return new NumberLinearAnimator(
      this.current,
      this.originalStart,
      this.totalTime
    )
  }
}