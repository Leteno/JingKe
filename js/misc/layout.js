"use strict";
exports.__esModule = true;
exports.LayoutParams = exports.Align = void 0;
var Align;
(function (Align) {
    Align[Align["START"] = 0] = "START";
    Align[Align["END"] = 1] = "END";
    Align[Align["CENTER"] = 2] = "CENTER";
})(Align = exports.Align || (exports.Align = {}));
var LayoutParams = /** @class */ (function () {
    function LayoutParams(xcfg, ycfg) {
        this.xcfg = xcfg;
        this.ycfg = ycfg;
    }
    LayoutParams.normal = function () {
        return new LayoutParams(Align.START, Align.START);
    };
    return LayoutParams;
}());
exports.LayoutParams = LayoutParams;
