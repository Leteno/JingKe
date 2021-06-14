"use strict";
exports.__esModule = true;
var panel_1 = require("./widgets/panel");
var textview_1 = require("./widgets/textview");
var ctx = canvas.getContext('2d');
var Main = /** @class */ (function () {
    function Main() {
        // id of requestAnimationFrame
        this.aniId = 0;
        this.mainPanel = new panel_1["default"]();
        this.bindLoop = this.gameLoop.bind(this);
        this.restart();
    }
    Main.prototype.restart = function () {
        this.mainPanel.removeAllViews();
        var textView = new textview_1["default"]("Hello World");
        this.mainPanel.addView(textView);
        textView.x = canvas.width / 2;
        textView.y = canvas.height / 2;
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
    };
    Main.prototype.gameLoop = function () {
        this.update();
        this.render();
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
    };
    Main.prototype.update = function () {
        // do nothing
    };
    Main.prototype.render = function () {
        this.mainPanel.drawToCanvas(ctx);
    };
    return Main;
}());
exports["default"] = Main;
