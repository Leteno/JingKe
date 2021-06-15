"use strict";
exports.__esModule = true;
var number_linear_animator_1 = require("../animator/number-linear-animator");
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
        imageView.width = imageView.height = 100;
        this.imageView = imageView;
        this.animator = new number_linear_animator_1["default"](0, canvas.height * 2, 1);
    }
    WelcomeScene.prototype.update = function () {
        this.animator.update();
        this.imageView.y = this.animator.getVal();
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
