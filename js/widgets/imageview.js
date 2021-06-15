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
var ImageView = /** @class */ (function (_super) {
    __extends(ImageView, _super);
    function ImageView(imgSrc, width, height, x, y) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, width, height, x, y, true) || this;
        _this.img = new Image();
        _this.img.src = imgSrc;
        return _this;
    }
    // override
    ImageView.prototype.drawToCanvasInternal = function (ctx, x, y, width, height) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    return ImageView;
}(sprite_1["default"]));
exports["default"] = ImageView;
