"use strict";
exports.__esModule = true;
var NumberLinearAnimator = /** @class */ (function () {
    function NumberLinearAnimator(start, end, feet) {
        if (feet === undefined) {
            feet = start > end ? -1 : 1;
        }
        this.start = start;
        this.end = end;
        this.feet = feet;
        this.stop = false;
    }
    NumberLinearAnimator.prototype.isStop = function () {
        return this.stop;
    };
    NumberLinearAnimator.prototype.onStop = function () {
    };
    NumberLinearAnimator.prototype.update = function () {
        if (this.stop)
            return;
        this.start += this.feet;
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
