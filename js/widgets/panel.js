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
var event_1 = require("../misc/event");
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super.call(this) || this;
        _this.children = new Array();
        return _this;
    }
    Panel.prototype.measure = function (ctx, maxWidth, maxHeight) {
        if (maxWidth === void 0) { maxWidth = -1; }
        if (maxHeight === void 0) { maxHeight = -1; }
        return this.onMeasure(ctx, maxWidth, maxHeight);
    };
    Panel.prototype.onMeasure = function (ctx, maxWidth, maxHeight) {
        var widthAtMost = 0;
        var heightAtMost = 0;
        if (this.forceWidth > 0)
            maxWidth = this.forceWidth;
        if (this.forceHeight > 0)
            maxHeight = this.forceHeight;
        this.children.forEach(function (view) {
            var size = view.measure(ctx, maxWidth, maxHeight);
            widthAtMost = Math.max(size.widthAtMost, widthAtMost);
            heightAtMost = Math.max(size.heightAtMost, heightAtMost);
        });
        if (this.forceWidth > 0 && this.forceHeight > 0) {
            this.width = this.forceWidth;
            this.height = this.forceHeight;
            return {
                widthAtMost: this.forceWidth,
                heightAtMost: this.forceHeight
            };
        }
        this.width = widthAtMost;
        this.height = heightAtMost;
        return {
            widthAtMost: widthAtMost + this.getLandscapeMargin(),
            heightAtMost: heightAtMost + this.getPortraitMargin()
        };
    };
    Panel.prototype.layout = function () {
        this.onLayout(this.width, this.height);
    };
    Panel.prototype.onLayout = function (width, height) {
        var _this = this;
        _super.prototype.onLayout.call(this, width, height);
        this.children.forEach(function (view) {
            view.onLayout(_this.width, _this.height);
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
    Panel.prototype.drawToCanvasInternal = function (ctx, x, y) {
        ctx.save();
        ctx.translate(this.x, this.y);
        this.children.forEach((function (view) {
            view.drawToCanvasInternal(ctx, view.x, view.y, view.width, view.height);
        }));
        ctx.restore();
    };
    Panel.prototype.onclick = function (event) {
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
}(sprite_1["default"]));
exports["default"] = Panel;
