import Animator from "./animator";

export default class DualStateInfiniteAnimator implements Animator<boolean> {
  private interval: number;
  private lastRemainTime: number;
  private on: boolean;
  constructor(interval: number, defaultOn: boolean) {
    this.interval = interval;
    this.lastRemainTime = 0;
    this.on = defaultOn;
  }

  update(dt: number): number {
    let passTime = this.lastRemainTime + dt;
    let flipTime = Math.floor(passTime / this.interval);
    if (flipTime % 2 == 1) {
      this.on = !this.on;
      this.onValChange(this.on);
    }
    this.lastRemainTime = passTime - flipTime * this.interval;
    return 0;
  }
  getVal(): boolean {
    return this.on;
  }
  onValChange(val: boolean) {
  }
  isStop(): boolean {
    return false;
  }
  onStop() {
  }
}