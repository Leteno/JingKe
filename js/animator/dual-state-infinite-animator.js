"use strict";
exports.__esModule = true;
var DualStateInfiniteAnimator = /** @class */ (function () {
    function DualStateInfiniteAnimator(interval, defaultOn) {
        this.interval = interval;
        this.lastRemainTime = 0;
        this.on = defaultOn;
    }
    DualStateInfiniteAnimator.prototype.update = function (dt) {
        var passTime = this.lastRemainTime + dt;
        var flipTime = Math.floor(passTime / this.interval);
        if (flipTime % 2 == 1) {
            this.on = !this.on;
            this.onValChange(this.on);
        }
        this.lastRemainTime = passTime - flipTime * this.interval;
    };
    DualStateInfiniteAnimator.prototype.getVal = function () {
        return this.on;
    };
    DualStateInfiniteAnimator.prototype.onValChange = function (val) {
    };
    DualStateInfiniteAnimator.prototype.isStop = function () {
        return false;
    };
    DualStateInfiniteAnimator.prototype.onStop = function () {
    };
    return DualStateInfiniteAnimator;
}());
exports["default"] = DualStateInfiniteAnimator;
