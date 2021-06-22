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
var easy_math_1 = require("../misc/easy-math");
var sprite_1 = require("./sprite");
var layout_1 = require("../misc/layout");
var event_1 = require("../misc/event");
var Pair = /** @class */ (function () {
    function Pair() {
    }
    return Pair;
}());
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, width, height, x, y) || this;
        _this.children = new Array();
        return _this;
    }
    Panel.prototype.addView = function (view, alignX, alignY) {
        if (alignX === void 0) { alignX = layout_1.Align.START; }
        if (alignY === void 0) { alignY = layout_1.Align.START; }
        this.children.push({
            "view": view,
            "alignX": alignX,
            "alignY": alignY
        });
    };
    Panel.prototype.removeView = function (view) {
        var index = -1;
        this.children.forEach(function (pair, ind) {
            if (pair.view == view) {
                index = ind;
            }
        });
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
        this.children.forEach((function (pair) {
            var view = pair.view;
            var alignX = pair.alignX;
            var finalX = alignX == layout_1.Align.START ? x + view.x :
                alignX == layout_1.Align.END ? x + _this.width - view.x :
                    /* Align.CENTER */ x + Math.max(_this.width - view.width, 0) / 2 + view.x;
            var alignY = pair.alignY;
            var finalY = alignY == layout_1.Align.START ? y + view.y :
                alignY == layout_1.Align.END ? y + _this.height - view.y :
                    /* Align.Center */ y + Math.max(_this.height - view.height, 0) / 2 + view.y;
            view.drawToCanvasInternal(ctx, finalX, finalY, view.width, view.height);
        }));
    };
    Panel.prototype.onclick = function (event) {
        var inside = easy_math_1["default"].between(this.x, this.x + this.width, event.x)
            && easy_math_1["default"].between(this.y, this.y + this.height, event.y);
        if (!inside)
            return false;
        // event cut out
        var childEvent = event_1.ClickEvent.alignChildren(event, this.x, this.y);
        for (var i = 0; i < this.children.length; i++) {
            var view = this.children[i].view;
            if (view.onclick(childEvent)) {
                return true;
            }
        }
        return this.onclickInternal(event);
    };
    return Panel;
}(sprite_1["default"]));
exports["default"] = Panel;
