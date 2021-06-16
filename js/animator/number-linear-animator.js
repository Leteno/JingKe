"use strict";
exports.__esModule = true;
var NumberLinearAnimator = /** @class */ (function () {
    function NumberLinearAnimator(start, end, totalTime) {
        this.start = start;
        this.end = end;
        this.totalTime = totalTime;
        if (totalTime > 0) {
            this.feet = (end - start) / totalTime;
        }
        else {
            this.feet = end - start;
        }
        this.stop = false;
    }
    NumberLinearAnimator.prototype.isStop = function () {
        return this.stop;
    };
    NumberLinearAnimator.prototype.onStop = function () {
    };
    NumberLinearAnimator.prototype.update = function (dt) {
        if (this.stop)
            return;
        this.start += this.feet * dt;
        if (this.feet > 0) {
            if (this.start > this.end) {
                this.start = this.end;
            }
        }
        else {
            if (this.start < this.end) {
                this.start = this.end;
            }
        }
        if (this.start === this.end) {
            this.stop = true;
            this.onStop();
        }
    };
    NumberLinearAnimator.prototype.getVal = function () {
        return this.start;
    };
    return NumberLinearAnimator;
}());
exports["default"] = NumberLinearAnimator;
