"use strict";
exports.__esModule = true;
var EasyMath = /** @class */ (function () {
    function EasyMath() {
    }
    EasyMath.between = function (from, to, test) {
        return from <= test && to >= test;
    };
    return EasyMath;
}());
exports["default"] = EasyMath;
