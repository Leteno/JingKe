"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var layout_1 = require("../misc/layout");
var sprite_1 = require("./sprite");
var SimpleView = /** @class */ (function (_super) {
    __extends(SimpleView, _super);
    function SimpleView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleView.prototype.measure = function (ctx, maxWidth, maxHeight) {
        if (this.forceWidth > 0 && this.forceHeight > 0) {
            this.width = this.forceWidth;
            this.height = this.forceHeight;
            this.calculateActualSize(ctx, this.forceWidth - this.padding.left - this.padding.right, this.forceHeight - this.padding.top - this.padding.bottom);
        }
        else {
            var measureResult = this.calculateActualSize(ctx, maxWidth - this.padding.left - this.padding.right
                - this.getLandscapeMargin(), maxHeight - this.padding.top - this.padding.bottom
                - this.getPortraitMargin());
            this.width = measureResult.calcWidth +
                this.padding.left + this.padding.right;
            this.height = measureResult.calcHeight +
                this.padding.top + this.padding.bottom;
        }
        return {
            calcWidth: this.width + this.getLandscapeMargin(),
            calcHeight: this.height + this.getPortraitMargin()
        };
    };
    /**
     * Return margin in Landscape regard of align
     */
    SimpleView.prototype.getLandscapeMargin = function () {
        var ret = this.margin.left + this.margin.right;
        if (layout_1.Align.CENTER == this.layoutParam.xcfg) {
            ret = Math.max(this.margin.left, this.margin.right) * 2;
        }
        return ret;
    };
    /**
     * Return margin in Portrait regard of align
     */
    SimpleView.prototype.getPortraitMargin = function () {
        var ret = this.margin.top + this.margin.bottom;
        if (layout_1.Align.CENTER == this.layoutParam.xcfg) {
            ret = Math.max(this.margin.top, this.margin.bottom) * 2;
        }
        return ret;
    };
    SimpleView.prototype.layout = function (parentWidth, parentHeight) {
        switch (this.layoutParam.xcfg) {
            case layout_1.Align.CENTER:
                this.x = (parentWidth - this.width) / 2 + this.margin.left;
                break;
            case layout_1.Align.END:
                this.x = parentWidth - this.width - this.margin.right;
                break;
            default:
                this.x = this.margin.left;
                break;
        }
        switch (this.layoutParam.ycfg) {
            case layout_1.Align.CENTER:
                this.y = (parentHeight - this.height) / 2 + this.margin.top;
                break;
            case layout_1.Align.END:
                this.y = parentHeight - this.height - this.margin.bottom;
                break;
            default:
                this.y = this.margin.top;
                break;
        }
        this.onLayout(parentWidth, parentHeight);
    };
    SimpleView.prototype.drawToCanvas = function (ctx) {
        if (!this.visible)
            return;
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.border) {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, this.width, this.height);
            ctx.restore();
        }
        this.drawToCanvasInternal(ctx);
        ctx.restore();
    };
    return SimpleView;
}(sprite_1["default"]));
exports["default"] = SimpleView;
