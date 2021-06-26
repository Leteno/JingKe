"use strict";
exports.__esModule = true;
exports.ClickEvent = void 0;
var ClickEvent = /** @class */ (function () {
    function ClickEvent(x, y) {
        this.x = x;
        this.y = y;
    }
    ClickEvent.from = function (pEvent) {
        return new ClickEvent(pEvent.offsetX, pEvent.offsetY);
    };
    // Suppose we have a clickEvent(100, 200)
    // And we have a panel(x:50, y:50) with viewA and viewB
    // After alignChildren, the return event would be (50, 150)
    // And viewA or viewB could just compare with its position
    ClickEvent.alignChildren = function (event, x, y) {
        var ret = new ClickEvent(event.x, event.y);
        ret.x -= x;
        ret.y -= y;
        return ret;
    };
    return ClickEvent;
}());
exports.ClickEvent = ClickEvent;