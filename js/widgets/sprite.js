"use strict";
exports.__esModule = true;
exports.MeasureResult = void 0;
var easy_math_1 = require("../misc/easy-math");
var layout_1 = require("../misc/layout");
var MeasureResult = /** @class */ (function () {
    function MeasureResult() {
    }
    return MeasureResult;
}());
exports.MeasureResult = MeasureResult;
var Sprite = /** @class */ (function () {
    function Sprite(layoutParam, visible) {
        if (layoutParam === void 0) { layoutParam = layout_1.LayoutParams.normal(); }
        if (visible === void 0) { visible = true; }
        this.layoutParam = layoutParam;
        this.visible = visible;
        this.forceWidth = -1;
        this.forceHeight = -1;
        this.width = this.height = 0;
        this.x = this.y = 0;
        this.left = this.top = 0;
        this.right = this.bottom = 0;
    }
    Sprite.prototype.measure = function (ctx, maxWidth, maxHeight) {
        if (this.forceWidth > 0 && this.forceHeight > 0) {
            this.width = this.forceWidth;
            this.height = this.forceHeight;
            return {
                widthAtMost: this.forceWidth + this.getLandscapeMargin(),
                heightAtMost: this.forceHeight + this.getPortraitMargin()
            };
        }
        return this.onMeasure(ctx, maxWidth, maxHeight);
    };
    Sprite.prototype.getLandscapeMargin = function () {
        var ret = this.left + this.right;
        if (layout_1.Align.CENTER == this.layoutParam.xcfg) {
            ret = Math.max(this.left, this.right) * 2;
        }
        return ret;
    };
    Sprite.prototype.getPortraitMargin = function () {
        var ret = this.top + this.bottom;
        if (layout_1.Align.CENTER == this.layoutParam.xcfg) {
            ret = Math.max(this.top, this.bottom) * 2;
        }
        return ret;
    };
    // (left, top) - width, height, those are parent's attribute.
    // And under such situation, we need to calculate the x,y for the layout
    Sprite.prototype.onLayout = function (width, height) {
        switch (this.layoutParam.xcfg) {
            case layout_1.Align.CENTER:
                this.x = (width - this.width) / 2 + this.left;
                break;
            case layout_1.Align.END:
                this.x = width - this.width - this.right;
                break;
            default:
                this.x = this.left;
                break;
        }
        switch (this.layoutParam.ycfg) {
            case layout_1.Align.CENTER:
                this.y = (height - this.height) / 2 + this.top;
                break;
            case layout_1.Align.END:
                this.y = height - this.height - this.bottom;
                break;
            default:
                this.y = this.top;
                break;
        }
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
