"use strict";
exports.__esModule = true;
var welcome_scene_1 = require("./game/welcome-scene");
var time_1 = require("./misc/time");
var Main = /** @class */ (function () {
    function Main(canvas) {
        // id of requestAnimationFrame
        this.aniId = 0;
        this.bindLoop = this.gameLoop.bind(this);
        this.ctx = canvas.getContext('2d');
        this.last = time_1.timestamp();
        this.currentScene = new welcome_scene_1["default"](canvas);
        this.restart();
    }
    Main.prototype.restart = function () {
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    };
    Main.prototype.gameLoop = function () {
        var now = time_1.timestamp();
        var dt = now - this.last;
        this.update(dt);
        this.render();
        this.last = now;
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    };
    Main.prototype.update = function (dt) {
        this.currentScene.update(dt);
    };
    Main.prototype.render = function () {
        this.currentScene.render(this.ctx);
    };
    return Main;
}());
exports["default"] = Main;
