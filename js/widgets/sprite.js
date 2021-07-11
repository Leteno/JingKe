"use strict";
exports.__esModule = true;
exports.Border = exports.MeasureResult = void 0;
var easy_math_1 = require("../misc/easy-math");
var layout_1 = require("../misc/layout");
var MeasureResult = /** @class */ (function () {
    function MeasureResult() {
    }
    return MeasureResult;
}());
exports.MeasureResult = MeasureResult;
var Border = /** @class */ (function () {
    function Border() {
    }
    return Border;
}());
exports.Border = Border;
var _Gap = /** @class */ (function () {
    function _Gap() {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
    }
    return _Gap;
}());
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
        this.margin = new _Gap();
        this.padding = new _Gap();
    }
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
        if (!this.visible)
            return false;
        var inside = easy_math_1["default"].between(this.x, this.x + this.width, event.x)
            && easy_math_1["default"].between(this.y, this.y + this.height, event.y);
        if (!inside)
            return false;
        return this.onclickInternal(event);
    };
    Sprite.prototype.onclickInternal = function (event) {
        return false;
    };
    return Sprite;
}());
exports["default"] = Sprite;
