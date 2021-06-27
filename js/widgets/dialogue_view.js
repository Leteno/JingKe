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
var number_linear_animator_1 = require("../animator/number-linear-animator");
var layout_1 = require("../misc/layout");
var panel_1 = require("./panel");
var textview_1 = require("./textview");
var DialogueView = /** @class */ (function (_super) {
    __extends(DialogueView, _super);
    function DialogueView() {
        var _this = _super.call(this) || this;
        _this.layoutParam = new layout_1.LayoutParams(layout_1.Align.START, layout_1.Align.END);
        _this.left = 20;
        _this.right = 20;
        _this.bottom = 20;
        // Add all views:
        _this.nameViewLeft = new textview_1["default"]("郑大侠");
        _this.nameViewRight = new textview_1["default"]("嘉女士");
        _this.contentView = new textview_1["default"]("你好，冒险者");
        _this.addView(_this.nameViewLeft);
        _this.addView(_this.nameViewRight);
        _this.addView(_this.contentView);
        // Configure View position
        _this.nameViewLeft.left = 20;
        _this.nameViewLeft.top = 10;
        _this.nameViewRight.right = 60;
        _this.nameViewRight.top = 10;
        _this.nameViewRight.layoutParam = new layout_1.LayoutParams(layout_1.Align.END, layout_1.Align.START);
        _this.nameViewRight.visible = false;
        _this.contentView.left = 20;
        _this.contentView.right = 50;
        _this.contentView.top = 40;
        _this.contentView.bottom = 20;
        _this.contentView.textSize = 16;
        // Animator
        _this.animators = new Array();
        // Others
        _this.expectedContentText = "你好，冒险者";
        _this.queue = new Array();
        _this.debug = false;
        return _this;
    }
    DialogueView.prototype.drawToCanvasInternal = function (ctx, x, y) {
        if (this.debug) {
            ctx.save();
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width - this.getLandscapeMargin(), this.height - this.getPortraitMargin());
        ctx.restore();
        if (this.expectedContentText != this.contentView.text) {
            this.contentView.text = this.expectedContentText;
            this.measure(ctx, this.width - this.getLandscapeMargin(), this.height - this.getPortraitMargin());
        }
        _super.prototype.drawToCanvasInternal.call(this, ctx, x, y);
    };
    DialogueView.prototype.addDialogue = function (data) {
        this.queue.push(data);
        if (this.animators.length == 0 ||
            this.animators.findIndex((function (animator) {
                return animator.isStop();
            }))) {
            var top_1 = this.queue.slice(0, 1)[0];
            this.updateView(top_1);
        }
    };
    DialogueView.prototype.updateView = function (data) {
        var _this = this;
        var view = data.showAtLeft ? this.nameViewLeft
            : this.nameViewRight;
        view.text = data.username;
        this.animators.splice(0);
        var supposedTime = data.content.length * 1000 / data.speed;
        var contentAnimator = new number_linear_animator_1["default"](0, data.content.length, supposedTime);
        contentAnimator.onValChange = (function (val) {
            _this.expectedContentText =
                data.content.substr(0, val);
        }).bind(this);
        contentAnimator.onStop =
            this.onContentLoadCompleted.bind(this);
        this.animators.push(contentAnimator);
    };
    DialogueView.prototype.updateTime = function (dt) {
        this.animators.forEach(function (animator) {
            animator.update(dt);
        });
    };
    DialogueView.prototype.onContentLoadCompleted = function () {
        console.log("onContentLoadComplete");
    };
    DialogueView.prototype.onclickInternal = function (event) {
        if (this.animators.length > 0 &&
            this.animators.findIndex(function (animator) {
                return !animator.isStop();
            })) {
            // click to skip the animation.
            this.animators.forEach(function (animator) {
                animator.update(animator.totalTime);
            });
        }
        else {
            // click to update data:
            if (this.queue.length > 0) {
                var front = this.queue.slice(0, 1)[0];
                this.updateView(front);
            }
        }
        return true;
    };
    return DialogueView;
}(panel_1["default"]));
exports["default"] = DialogueView;
