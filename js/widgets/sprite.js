"use strict";
exports.__esModule = true;
exports.MeasureResult = void 0;
var easy_math_1 = require("../misc/easy-math");
var MeasureResult = /** @class */ (function () {
    function MeasureResult() {
    }
    return MeasureResult;
}());
exports.MeasureResult = MeasureResult;
var Sprite = /** @class */ (function () {
    function Sprite(left, top, visible) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (visible === void 0) { visible = true; }
        this.left = left;
        this.top = top;
        this.visible = visible;
        this.forceWidth = -1;
        this.forceHeight = -1;
        this.width = this.height = 0;
        this.x = this.y = 0;
    }
    Sprite.prototype.measure = function (ctx) {
        if (this.forceWidth > 0 && this.forceHeight > 0) {
            this.width = this.forceWidth;
            this.height = this.forceHeight;
            return {
                widthAtMost: this.forceWidth + this.left,
                heightAtMost: this.forceHeight + this.top
            };
        }
        return this.onMeasure(ctx);
    };
    Sprite.prototype.layout = function (left, top, right, bottom) {
        return this.onLayout(left, top, right, bottom);
    };
    // public final
    Sprite.prototype.drawToCanvas = function (ctx) {
        if (!this.visible)
            return;
        this.drawToCanvasInternal(ctx, this.x, this.y, this.width, this.height);
    };
    Sprite.prototype.isCollideWith = function (sp) {
        if (!this.visible || !sp.visible)
            return false;
        var spX = sp.x + sp.width / 2;
        var spY = sp.y + sp.height / 2;
        return !!(spX >= this.x
            && spX <= this.x + this.width
            && spY >= this.y
            && spY <= this.y + this.height);
    };
    Sprite.prototype.onclick = function (event) {
        var inside = easy_math_1["default"].between(this.x, this.x + this.width, event.x)
            && easy_math_1["default"].between(this.y, this.y + this.height, event.y);
        if (!inside)
            return false;
        return this.onclickInternal(event);
    };
    Sprite.prototype.onclickInternal = function (event) {
        return true;
    };
    return Sprite;
}());
exports["default"] = Sprite;
