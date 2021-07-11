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
var event_1 = require("../misc/event");
var simple_view_1 = require("./simple_view");
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super.call(this) || this;
        _this.children = new Array();
        return _this;
    }
    Panel.prototype.calculateActualSize = function (ctx, maxWidthForCalculation, maxHeightForCalculation) {
        var childWidthAtMost = 0;
        var childHeightAtMost = 0;
        this.children.forEach(function (view) {
            var size = view.measure(ctx, maxWidthForCalculation, maxHeightForCalculation);
            childWidthAtMost = Math.max(size.calcWidth, childWidthAtMost);
            childHeightAtMost = Math.max(size.calcHeight, childHeightAtMost);
        });
        return {
            calcWidth: childWidthAtMost,
            calcHeight: childHeightAtMost
        };
    };
    Panel.prototype.onLayout = function (parentWidth, parentHeight) {
        var _this = this;
        this.children.forEach(function (view) {
            view.layout(_this.width - _this.padding.left - _this.padding.right, _this.height - _this.padding.top - _this.padding.bottom);
        });
    };
    Panel.prototype.addView = function (view) {
        this.children.push(view);
    };
    Panel.prototype.removeView = function (view) {
        var index = this.children.findIndex(function (v) { return v == view; });
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    };
    Panel.prototype.removeAllViews = function () {
        this.children.splice(0);
    };
    // override
    Panel.prototype.drawToCanvasInternal = function (ctx) {
        ctx.save();
        ctx.translate(this.padding.left, this.padding.top);
        this.children.forEach((function (view) {
            view.drawToCanvas(ctx);
        }));
        ctx.restore();
    };
    Panel.prototype.onclick = function (event) {
        if (!this.visible)
            return false;
        var inside = easy_math_1["default"].between(this.x, this.x + this.width, event.x)
            && easy_math_1["default"].between(this.y, this.y + this.height, event.y);
        if (!inside)
            return false;
        // event cut out
        var childEvent = event_1.ClickEvent.alignChildren(event, this.x, this.y);
        for (var i = 0; i < this.children.length; i++) {
            var view = this.children[i];
            if (view.onclick(childEvent)) {
                return true;
            }
        }
        return this.onclickInternal(event);
    };
    return Panel;
}(simple_view_1["default"]));
exports["default"] = Panel;
