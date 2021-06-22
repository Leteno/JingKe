"use strict";
exports.__esModule = true;
var easy_math_1 = require("../misc/easy-math");
var Sprite = /** @class */ (function () {
    function Sprite(width, height, x, y, visible) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (visible === void 0) { visible = true; }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.visible = visible;
    }
    // public final
    Sprite.prototype.drawToCanvas = function (ctx) {
        if (!this.visible)
            return;
        this.drawToCanvasInternal(ctx, this.x, this.y, this.width, this.height);
    };
    // protected
    Sprite.prototype.drawToCanvasInternal = function (ctx, x, y, width, height) {
        // do nothing
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
