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
var simple_view_1 = require("./simple_view");
var ImageView = /** @class */ (function (_super) {
    __extends(ImageView, _super);
    function ImageView(imgSrc) {
        var _this = _super.call(this) || this;
        _this.img = new Image();
        _this.img.src = imgSrc;
        return _this;
    }
    // override
    ImageView.prototype.drawToCanvasIntdernal = function (ctx, x, y, width, height) {
    };
    ImageView.prototype.calculateActualSize = function (ctx, maxWidthForCalculation, maxHeightForCalculation) {
        this.width = this.img.naturalWidth;
        this.height = this.img.naturalHeight;
        return {
            calcWidth: this.width,
            calcHeight: this.height
        };
    };
    ImageView.prototype.onLayout = function (parentWidth, parentHeight) {
    };
    ImageView.prototype.drawToCanvasInternal = function (ctx) {
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
    };
    return ImageView;
}(simple_view_1["default"]));
exports["default"] = ImageView;
