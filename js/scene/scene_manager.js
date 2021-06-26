"use strict";
exports.__esModule = true;
var SceneManager = /** @class */ (function () {
    function SceneManager(ctx) {
        this.ctx = ctx;
        this.sceneMap = new Map();
    }
    SceneManager.prototype.push = function (key, scene) {
        if (this.sceneMap.has(key)) {
            console.warn("conflict to push scene " + key + " " + scene);
            return false;
        }
        this.sceneMap.set(key, scene);
    };
    SceneManager.prototype.remove = function (key) {
        if (!this.sceneMap.has(key)) {
            return false;
        }
        return this.sceneMap["delete"](key);
    };
    /**
     * Will switch to the scene which is named key.
     *
     * Will raise exception if there is no scene related to key.
     */
    SceneManager.prototype.switchScene = function (key) {
        if (!this.sceneMap.has(key)) {
            console.warn("switchScene to key " + key + " which has no scene related");
            return;
        }
        this.currentScene = this.sceneMap.get(key);
        this.currentScene.onStart(this.ctx);
    };
    return SceneManager;
}());
exports["default"] = SceneManager;
