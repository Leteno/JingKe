"use strict";
exports.__esModule = true;
var imageview_1 = require("./widgets/imageview");
var panel_1 = require("./widgets/panel");
var textview_1 = require("./widgets/textview");
var Main = /** @class */ (function () {
    function Main(canvas) {
        // id of requestAnimationFrame
        this.aniId = 0;
        this.mainPanel = new panel_1["default"]();
        this.bindLoop = this.gameLoop.bind(this);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.restart();
    }
    Main.prototype.restart = function () {
        this.mainPanel.removeAllViews();
        var textView = new textview_1["default"]("Hello World");
        this.mainPanel.addView(textView);
        textView.x = this.canvas.width / 2;
        textView.y = this.canvas.height / 2;
        var imageView = new imageview_1["default"]("res/artichoke_PNG30.png");
        this.mainPanel.addView(imageView);
        imageView.x = this.canvas.width / 3;
        imageView.y = this.canvas.width / 4;
        imageView.width = imageView.height = 100;
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    };
    Main.prototype.gameLoop = function () {
        this.update();
        this.render();
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    };
    Main.prototype.update = function () {
        // do nothing
    };
    Main.prototype.render = function () {
        this.mainPanel.drawToCanvas(this.ctx);
    };
    return Main;
}());
exports["default"] = Main;
