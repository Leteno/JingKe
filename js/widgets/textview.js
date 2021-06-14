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
    function TextView(text, x, y) {
        if (text === void 0) { text = "Hello World"; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, 0, 0, x, y) || this;
        _this.text = text;
        return _this;
    }
    // override
    TextView.prototype.drawToCanvasInternal = function (ctx, x, y) {
        ctx.fillText(this.text, x, y);
    };
    return TextView;
}(sprite_1["default"]));
exports["default"] = TextView;
