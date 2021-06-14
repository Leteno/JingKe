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
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, 0, 0, x, y) || this;
        _this.children = new Array();
        return _this;
    }
    Panel.prototype.addView = function (view) {
        this.children.push(view);
    };
    Panel.prototype.removeView = function (view) {
        var index = this.children.indexOf(view);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    };
    Panel.prototype.removeAllViews = function () {
        this.children.splice(0);
    };
    // override
    Panel.prototype.drawToCanvasInternal = function (ctx, x, y) {
        var _this = this;
        this.children.forEach((function (view) {
            view.drawToCanvasInternal(ctx, x = view.x + _this.x, y = view.y + _this.y, view.width, view.height);
        }));
    };
    return Panel;
}(sprite_1["default"]));
exports["default"] = Panel;
