"use strict";
exports.__esModule = true;
var number_linear_animator_1 = require("../animator/number-linear-animator");
var layout_1 = require("../misc/layout");
var imageview_1 = require("../widgets/imageview");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var WelcomeScene = /** @class */ (function () {
    function WelcomeScene(canvas) {
        this.mainPanel = new panel_1["default"](0, 0, canvas.width, canvas.height);
        this.animators = new Array();
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }
    WelcomeScene.prototype.onStart = function (ctx) {
        var textView = new textview_1["default"]("荆轲刺秦王");
        this.mainPanel.addView(textView, layout_1.Align.CENTER, layout_1.Align.CENTER);
        textView.textColor = "black";
        textView.textSize = 40;
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.x = this.canvasWidth / 3;
        imageView.width = imageView.height = 100;
        var animatorImageViewY = new number_linear_animator_1["default"](0, this.canvasHeight * 2, 20000);
        animatorImageViewY.onValChange = function (val) {
            imageView.y = animatorImageViewY.getVal();
        };
        this.animators.push(animatorImageViewY);
        var text = textView.text;
        var animatorTextViewString = new number_linear_animator_1["default"](0, textView.text.length, 2000);
        animatorTextViewString.onValChange = function (val) {
            textView.text = text.substring(0, Math.floor(val));
        };
        this.animators.push(animatorTextViewString);
    };
    WelcomeScene.prototype.update = function (dt) {
        this.animators.forEach((function (animator) {
            animator.update(dt);
        }));
    };
    WelcomeScene.prototype.render = function (ctx) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
        this.mainPanel.drawToCanvas(ctx);
    };
    return WelcomeScene;
}());
exports["default"] = WelcomeScene;