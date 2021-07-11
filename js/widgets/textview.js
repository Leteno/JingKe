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
exports.TextHelper = void 0;
var simple_view_1 = require("./simple_view");
var TextView = /** @class */ (function (_super) {
    __extends(TextView, _super);
    function TextView(text) {
        if (text === void 0) { text = "Hello World"; }
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.textColor = "black";
        _this.textSize = 24;
        _this.lines = new Array();
        _this.debug = false;
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
    TextView.prototype.calculateActualSize = function (ctx, maxWidthForCalculation, maxHeightForCalculation) {
        ctx.save();
        this.applyStyle(ctx);
        var charNumEachLine = 1000;
        if (maxWidthForCalculation > 0) {
            charNumEachLine =
                TextHelper.getInstance().calculateCharInLine(ctx, this.textSize, maxWidthForCalculation);
        }
        this.lineHeight = this.textSize;
        this.lines.splice(0);
        var actualWidth = 0;
        var actualHeight = 0;
        for (var i = 0; i < this.text.length; i += charNumEachLine) {
            this.lines.push(this.text.substr(i, Math.min(charNumEachLine, this.text.length - i)));
            actualHeight += this.lineHeight;
        }
        if (this.lines.length > 1) {
            actualWidth = maxWidthForCalculation;
        }
        else {
            var metric = ctx.measureText(this.text);
            actualWidth = metric.width;
        }
        // TODO(juzhen) should we:
        // actualHeight = min(-, maxHeightForCalculation)
        ctx.restore();
        return {
            calcWidth: actualWidth,
            calcHeight: actualHeight
        };
    };
    TextView.prototype.onLayout = function () {
        // no special implementation.
    };
    // override
    TextView.prototype.drawToCanvasInternal = function (ctx) {
        if (this.debug) {
            ctx.save();
            ctx.fillStyle = "pink";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        ctx.save();
        this.applyStyle(ctx);
        for (var i = 0; i < this.lines.length; i++) {
            ctx.fillText(this.lines[i], 0, i * this.lineHeight);
        }
        ctx.restore();
    };
    return TextView;
}(simple_view_1["default"]));
exports["default"] = TextView;
// TODO: update measure height. Because we have multiple lines
var TextHelper = /** @class */ (function () {
    function TextHelper() {
        this.storeMap = new Map();
    }
    TextHelper.getInstance = function () {
        if (this.instance == null) {
            this.instance = new TextHelper();
        }
        return this.instance;
    };
    TextHelper.prototype.calculateCharInLine = function (ctx, textSize, maxWidth) {
        if (!this.storeMap.has(textSize)) {
            this.storeMap.set(textSize, new Map());
        }
        if (this.storeMap.get(textSize).has(maxWidth)) {
            return this.storeMap.get(textSize).get(maxWidth);
        }
        var text = "你好，世界";
        ctx.save();
        ctx.font = "$textSize}px bold";
        var drawLength = ctx.measureText(text).width;
        var textLength = text.length;
        var result = Math.floor(maxWidth / (drawLength / textLength));
        this.storeMap.get(textSize).set(maxWidth, result);
        ctx.restore();
        return result;
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;
