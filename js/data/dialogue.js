"use strict";
exports.__esModule = true;
var Dialogue = /** @class */ (function () {
    function Dialogue(username, content, showAtLeft, speed) {
        if (showAtLeft === void 0) { showAtLeft = true; }
        if (speed === void 0) { speed = 20; }
        this.username = username;
        this.content = content;
        this.showAtLeft = showAtLeft;
        this.speed = speed;
    }
    return Dialogue;
}());
exports["default"] = Dialogue;
