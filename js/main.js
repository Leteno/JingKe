"use strict";
exports.__esModule = true;
var welcome_scene_1 = require("./game/welcome-scene");
var time_1 = require("./misc/time");
var event_1 = require("./misc/event");
var Main = /** @class */ (function () {
    function Main(canvas) {
        // id of requestAnimationFrame
        this.aniId = 0;
        this.bindLoop = this.gameLoop.bind(this);
        this.ctx = canvas.getContext('2d');
        this.last = time_1.timestamp();
        this.currentScene = new welcome_scene_1["default"](canvas);
        this.currentScene.onStart(this.ctx);
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
        canvas.onclick = this.onclick.bind(this);
    }
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
    Main.prototype.onclick = function (event) {
        this.currentScene.onclick(event_1.ClickEvent.from(event));
    };
    return Main;
}());
exports["default"] = Main;
