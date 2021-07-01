"use strict";
exports.__esModule = true;
var dialogue_1 = require("../data/dialogue");
var dialogue_view_1 = require("../widgets/dialogue_view");
var panel_1 = require("../widgets/panel");
var Scene1 = /** @class */ (function () {
    function Scene1(canvas) {
        this.mainPanel = new panel_1["default"]();
        this.mainPanel.forceWidth = canvas.width;
        this.mainPanel.forceHeight = canvas.height;
        this.dialogueView = new dialogue_view_1["default"]();
        this.dialogueView.forceWidth = canvas.width;
        this.dialogueView.forceHeight = canvas.height / 4;
        this.mainPanel.addView(this.dialogueView);
    }
    Scene1.prototype.onStart = function (ctx) {
        this.dialogueView.addDialogue(new dialogue_1["default"]("荆棘", "我叔父是荆轲，荆棘是我的名字。"));
        this.dialogueView.addDialogue(new dialogue_1["default"]("荆棘", "叔父被人杀了，"));
        this.dialogueView.addDialogue(new dialogue_1["default"]("荆棘", "而我却没有替他报仇.."));
        this.dialogueView.addDialogue(new dialogue_1["default"]("荆棘", "这里面的纠缠在我脑中挥之不去，请你耐心听我倾诉"));
        this.dialogueView.addDialogue(new dialogue_1["default"]("荆棘", "那年我 16 岁，而叔父还在燕都太子做门客，我去投奔叔父...."));
        this.mainPanel.measure(ctx);
        this.mainPanel.layout();
    };
    Scene1.prototype.update = function (dt) {
        this.dialogueView.updateTime(dt);
    };
    Scene1.prototype.render = function (ctx) {
        this.mainPanel.drawToCanvas(ctx);
    };
    Scene1.prototype.onclick = function (event) {
        this.mainPanel.onclick(event);
    };
    return Scene1;
}());
exports["default"] = Scene1;
