"use strict";
exports.__esModule = true;
var text_affect_1 = require("../animator/text-affect");
var layout_1 = require("../misc/layout");
var dialogue_view_1 = require("../widgets/dialogue_view");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var SimpleScene = /** @class */ (function () {
    function SimpleScene(canvas, caption, title) {
        this.mainPanel = new panel_1["default"]();
        this.sceneCaption = new textview_1["default"](caption);
        this.sceneTitle = new textview_1["default"](title);
        this.mainPanel.addView(this.sceneCaption);
        this.mainPanel.addView(this.sceneTitle);
        this.mainPanel.forceWidth = canvas.width;
        this.mainPanel.forceHeight = canvas.height;
        this.sceneCaption.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
        this.sceneTitle.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
        this.sceneCaption.top = -50;
        this.animators = new Array();
        this.sceneCaption.textColor = "#FFFFFF";
        this.sceneTitle.textColor = "#FFFFFF";
        this.dialogueView = new dialogue_view_1["default"]();
        this.dialogueView.forceWidth = canvas.width;
        this.dialogueView.forceHeight = canvas.height / 4;
        this.dialogueView.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.END);
        this.mainPanel.addView(this.dialogueView);
        this.presetDialogues = new Array();
        this.sceneAnimationFinished = false;
    }
    SimpleScene.prototype.onStart = function (ctx) {
        var _this = this;
        this.mainPanel.measure(ctx);
        this.mainPanel.layout();
        var captionFadeIn = text_affect_1.textAlpha(true, 2000, this.sceneCaption);
        this.animators.push(captionFadeIn);
        var titleFadeIn = text_affect_1.textAlpha(true, 2500, this.sceneTitle);
        captionFadeIn.onStop = function () {
            _this.animators.push(titleFadeIn);
        };
        var captionFadeOut = text_affect_1.textAlpha(false, 2000, this.sceneCaption);
        var titleFadeOut = text_affect_1.textAlpha(false, 2000, this.sceneTitle);
        titleFadeIn.onStop = function () {
            _this.animators.push(captionFadeOut);
            _this.animators.push(titleFadeOut);
        };
        titleFadeOut.onStop = function () {
            _this.sceneAnimationFinished = true;
            _this.presetDialogues.forEach(function (item) {
                _this.dialogueView.addDialogue(item);
            });
        };
    };
    SimpleScene.prototype.update = function (dt) {
        this.animators.forEach(function (animator) {
            animator.update(dt);
        });
        this.dialogueView.updateTime(dt);
    };
    SimpleScene.prototype.render = function (ctx) {
        this.mainPanel.drawToCanvas(ctx);
    };
    SimpleScene.prototype.onclick = function (event) {
        this.mainPanel.onclick(event);
    };
    SimpleScene.prototype.addDialogue = function (data) {
        if (this.sceneAnimationFinished) {
            this.dialogueView.addDialogue(data);
        }
        else {
            this.presetDialogues.push(data);
        }
    };
    return SimpleScene;
}());
exports["default"] = SimpleScene;
