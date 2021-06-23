"use strict";
exports.__esModule = true;
var number_linear_animator_1 = require("../animator/number-linear-animator");
var layout_1 = require("../misc/layout");
var imageview_1 = require("../widgets/imageview");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var WelcomeScene = /** @class */ (function () {
    function WelcomeScene(canvas) {
        this.mainPanel = new panel_1["default"](0, 0);
        this.mainPanel.forceWidth = canvas.width;
        this.mainPanel.forceHeight = canvas.height;
        this.animators = new Array();
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }
    WelcomeScene.prototype.onStart = function (ctx) {
        var textView = new textview_1["default"]("荆轲刺秦王");
        this.mainPanel.addView(textView, layout_1.Align.CENTER, layout_1.Align.CENTER);
        textView.textColor = "black";
        textView.textSize = 40;
        textView.y = -100;
        textView.measure(ctx);
        textView.onclickInternal = function (event) {
            console.log("text is clicked");
            return true;
        };
        var startBtn = new textview_1["default"]("开始游戏");
        this.mainPanel.addView(startBtn, layout_1.Align.CENTER, layout_1.Align.CENTER);
        startBtn.textColor = "black";
        startBtn.textSize = 24;
        startBtn.visible = false;
        startBtn.onclickInternal = function (event) {
            console.log("startBtn is clicked");
            return true;
        };
        var configBtn = new textview_1["default"]("配置");
        this.mainPanel.addView(configBtn, layout_1.Align.CENTER, layout_1.Align.CENTER);
        configBtn.textColor = "black";
        configBtn.textSize = 24;
        configBtn.y = 60;
        configBtn.visible = false;
        configBtn.measure(ctx);
        configBtn.onclickInternal = function (event) {
            console.log("configBtn is clicked");
            return true;
        };
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.x = this.canvasWidth / 3;
        imageView.width = imageView.height = 100;
        this.mainPanel.measure(ctx);
        var animatorImageViewY = new number_linear_animator_1["default"](0, this.canvasHeight * 2, 20000);
        animatorImageViewY.onValChange = function (val) {
            imageView.y = animatorImageViewY.getVal();
        };
        this.animators.push(animatorImageViewY);
        var text = textView.text;
        var animatorTextViewString = new number_linear_animator_1["default"](0, textView.text.length, 1500);
        animatorTextViewString.onValChange = function (val) {
            textView.text = text.substring(0, Math.floor(val));
        };
        animatorTextViewString.onStop = function () {
            setTimeout(function () {
                startBtn.visible = true;
                configBtn.visible = true;
            }, 200);
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
    WelcomeScene.prototype.onclick = function (event) {
        this.mainPanel.onclick(event);
    };
    return WelcomeScene;
}());
exports["default"] = WelcomeScene;
