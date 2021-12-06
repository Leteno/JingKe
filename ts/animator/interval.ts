import Animator from "./animator"

/**
 * Interval:
 * Provide a way for people to run thing constantly in 
 * the same time gap.
 * 
 * User could set onInterval to specify the runnable,
 * when onInterval return false, the Interval will be stopped.
 */
export default class Interval implements Animator<number> {

    interval: number;
    onInterval: ()=>boolean;
    left: number;
    shouldStop: boolean;
    constructor(interval: number) {
        this.interval = interval;
        this.left = 0;
        this.shouldStop = false;
    }

    update(dt: number): number {
        if (this.shouldStop) return dt;

        var sum = this.left + dt;
        var left = sum;
        while (left >= this.interval) {
            left -= this.interval;
            if (this.onInterval) {
                this.shouldStop = !this.onInterval();
                if (this.shouldStop) {
                    // clean up && return
                    this.left = 0;
                    return left;
                }
            }
        }
        this.left = left;
        return 0;
    }

    getVal(): number {
        return this.left;
    }
    onValChange(val: number) {
    }
    isStop(): boolean {
        return this.shouldStop;
    }
    onStop() {
    }

}