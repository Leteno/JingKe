"use strict";
exports.__esModule = true;
var layout_1 = require("../misc/layout");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var HelloWorldScene = /** @class */ (function () {
    function HelloWorldScene(canvas) {
        this.mainPanel = new panel_1["default"]();
        this.mainPanel.forceWidth = canvas.width;
        this.mainPanel.forceHeight = canvas.height;
        var text = new textview_1["default"]("你好，过去");
        text.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
        this.mainPanel.addView(text);
    }
    HelloWorldScene.prototype.onStart = function (ctx) {
        this.mainPanel.measure(ctx);
        this.mainPanel.layout();
    };
    HelloWorldScene.prototype.update = function (dt) {
    };
    HelloWorldScene.prototype.render = function (ctx) {
        this.mainPanel.drawToCanvas(ctx);
    };
    HelloWorldScene.prototype.onclick = function (event) {
    };
    return HelloWorldScene;
}());
exports["default"] = HelloWorldScene;
