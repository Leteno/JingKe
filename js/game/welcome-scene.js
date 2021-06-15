"use strict";
exports.__esModule = true;
var imageview_1 = require("../widgets/imageview");
var panel_1 = require("../widgets/panel");
var textview_1 = require("../widgets/textview");
var WelcomeScene = /** @class */ (function () {
    function WelcomeScene(canvas) {
        this.mainPanel = new panel_1["default"]();
        var textView = new textview_1["default"]("Hello World");
        this.mainPanel.addView(textView);
        textView.x = canvas.width / 2;
        textView.y = canvas.height / 2;
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.x = canvas.width / 3;
        imageView.y = canvas.width / 4;
        imageView.width = imageView.height = 100;
    }
    WelcomeScene.prototype.update = function () {
    };
    WelcomeScene.prototype.render = function (ctx) {
        this.mainPanel.drawToCanvas(ctx);
    };
    return WelcomeScene;
}());
exports["default"] = WelcomeScene;
