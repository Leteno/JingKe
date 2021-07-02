"use strict";
exports.__esModule = true;
exports.textAlpha = void 0;
var number_linear_animator_1 = require("./number-linear-animator");
/**
 * control textView's alpha, support white <=> black only
 * @param fadeIn fadeIn if true, otherwise fadeOut
 */
function textAlpha(fadeIn, time, textView) {
    var from = 0, to = 254;
    if (fadeIn) {
        from = 254;
        to = 0;
    }
    var fadeInAnimator = new number_linear_animator_1["default"](from, to, 2000);
    fadeInAnimator.onValChange = function (val) {
        var alpha = Math.floor(val).toString(16);
        if (alpha.length == 1) {
            alpha = "0" + alpha;
        }
        var color = "#" + alpha + alpha + alpha;
        textView.textColor = color;
    };
    return fadeInAnimator;
}
exports.textAlpha = textAlpha;
