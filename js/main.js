"use strict";
exports.__esModule = true;
var welcome_scene_1 = require("./game/welcome-scene");
var scene_manager_1 = require("./scene/scene_manager");
var time_1 = require("./misc/time");
var event_1 = require("./misc/event");
var hello_world_scene_1 = require("./game/hello_world_scene");
var scene1_1 = require("./game/scene1");
var simple_scene_1 = require("./scene/simple_scene");
var dialogue_1 = require("./data/dialogue");
var Main = /** @class */ (function () {
    function Main(canvas) {
        this.canvas = canvas;
        // id of requestAnimationFrame
        this.aniId = 0;
        this.bindLoop = this.gameLoop.bind(this);
        this.ctx = canvas.getContext('2d');
        this.ctx.textBaseline = "top";
        this.last = time_1.timestamp();
        this.sceneManager = new scene_manager_1["default"](this.ctx);
        var welcomeScene = new welcome_scene_1["default"](this.sceneManager, canvas);
        this.sceneManager.push("welcome", welcomeScene);
        var helloWorldScene = new hello_world_scene_1["default"](canvas);
        this.sceneManager.push("helloWorld", helloWorldScene);
        var scene1 = new scene1_1["default"](canvas);
        this.sceneManager.push("scene1", scene1);
        var simpleScene = new simple_scene_1["default"](canvas, "Scene 01", "夕阳无限好，狼虎伺机动");
        this.sceneManager.push("simple", simpleScene);
        var dialogue = new dialogue_1["default"]("郑小则", "人生不如意事，十有八九，唯有一二，让你慰藉，希望你能开心");
        simpleScene.addDialogue(dialogue);
        this.sceneManager.switchScene("simple");
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
        this.sceneManager.currentScene.update(dt);
    };
    Main.prototype.render = function () {
        this.clearScreen();
        this.sceneManager.currentScene.render(this.ctx);
    };
    Main.prototype.clearScreen = function () {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    };
    Main.prototype.onclick = function (event) {
        this.sceneManager.currentScene.onclick(event_1.ClickEvent.from(event));
    };
    return Main;
}());
exports["default"] = Main;
