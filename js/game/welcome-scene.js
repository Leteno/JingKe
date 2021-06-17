"use strict";
exports.__esModule = true;
var number_linear_animator_1 = require("../animator/number-linear-animator");
var imageview_1 = require("../widgets/imageview");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var WelcomeScene = /** @class */ (function () {
    function WelcomeScene(canvas) {
        this.mainPanel = new panel_1["default"]();
        var textView = new textview_1["default"]("荆轲刺秦王");
        this.mainPanel.addView(textView);
        textView.x = canvas.width / 4;
        textView.y = canvas.height / 5;
        textView.textColor = "black";
        textView.textSize = 40;
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.x = canvas.width / 3;
        imageView.width = imageView.height = 100;
        this.animators = new Array();
        var animatorImageViewY = new number_linear_animator_1["default"](0, canvas.height * 2, 20000);
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
    }
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
