"use strict";
exports.__esModule = true;
var layout_1 = require("../misc/layout");
var number_linear_animator_1 = require("../animator/number-linear-animator");
var imageview_1 = require("../widgets/imageview");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var dialogue_view_1 = require("../widgets/dialogue_view");
var dialogue_1 = require("../data/dialogue");
var HelloWorldScene = /** @class */ (function () {
    function HelloWorldScene(canvas) {
        this.mainPanel = new panel_1["default"]();
        this.mainPanel.forceWidth = canvas.width;
        this.mainPanel.forceHeight = canvas.height;
        this.animators = new Array();
        var text = new textview_1["default"]("你好，过去");
        text.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
        this.mainPanel.addView(text);
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.left = canvas.width / 3;
        imageView.forceWidth = imageView.forceHeight = 100;
        this.mainPanel.addView(imageView);
        var animatorImageViewY = new number_linear_animator_1["default"](0, canvas.height * 2, 20000);
        animatorImageViewY.onValChange = function (val) {
            imageView.y = animatorImageViewY.getVal();
        };
        this.animators.push(animatorImageViewY);
        var longText = new textview_1["default"]("这是一个非常长，非常长的句子。我希望你能够帮忙换一下行");
        longText.layoutParam = new layout_1.LayoutParams(layout_1.Align.START, layout_1.Align.CENTER);
        longText.top = 100;
        longText.left = 20;
        longText.right = 40;
        longText.debug = true;
        this.mainPanel.addView(longText);
        this.dialogueView = new dialogue_view_1["default"]();
        this.dialogueView.forceWidth = canvas.width;
        this.dialogueView.forceHeight = canvas.height / 4;
        this.mainPanel.addView(this.dialogueView);
        this.dialogueView.addDialogue(new dialogue_1["default"]("郑虾米", "这是一段很长的话，但是如果你想看完，我也没有任何意见，只是觉得你或许可以做一点更有意义的事情"));
        this.dialogueView.addDialogue(new dialogue_1["default"]("郑虾米", "不要讲干话"));
    }
    HelloWorldScene.prototype.onStart = function (ctx) {
        this.mainPanel.measure(ctx);
        this.mainPanel.layout();
    };
    HelloWorldScene.prototype.update = function (dt) {
        this.animators.forEach(function (animator) {
            animator.update(dt);
        });
        this.dialogueView.updateTime(dt);
    };
    HelloWorldScene.prototype.render = function (ctx) {
        this.mainPanel.drawToCanvas(ctx);
    };
    HelloWorldScene.prototype.onclick = function (event) {
        this.mainPanel.onclick(event);
    };
    return HelloWorldScene;
}());
exports["default"] = HelloWorldScene;
