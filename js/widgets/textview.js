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
var sprite_1 = require("./sprite");
var TextView = /** @class */ (function (_super) {
    __extends(TextView, _super);
    function TextView(text) {
        if (text === void 0) { text = "Hello World"; }
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.textColor = "black";
        _this.textSize = undefined;
        return _this;
    }
    TextView.prototype.applyStyle = function (ctx) {
        if (this.textColor) {
            ctx.fillStyle = this.textColor;
        }
        if (this.textSize) {
            ctx.font = this.textSize + "px bold";
        }
    };
    TextView.prototype.onMeasure = function (ctx) {
        ctx.save();
        this.applyStyle(ctx);
        var metric = ctx.measureText(this.text);
        this.width = metric.width;
        this.height = this.textSize;
        console.log("textview width: " + this.width + " height: " + this.height);
        ctx.restore();
        return {
            widthAtMost: this.width + this.getAdditionalX(),
            heightAtMost: this.height + this.getAdditionalY()
        };
    };
    // override
    TextView.prototype.drawToCanvasInternal = function (ctx, x, y) {
        if (!this.visible)
            return;
        ctx.save();
        this.applyStyle(ctx);
        ctx.fillText(this.text, x, y);
        ctx.restore();
    };
    return TextView;
}(sprite_1["default"]));
exports["default"] = TextView;
