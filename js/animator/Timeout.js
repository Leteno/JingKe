"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var number_linear_animator_1 = require("./number-linear-animator");
/**
 * You could:
 * let timeout = new Timeout(2000);
 * timeout.onStop = () => {
 *   // The code I want to run when timeout
 * }
 * timeout.update(dt);
 */
var Timeout = /** @class */ (function (_super) {
    __extends(Timeout, _super);
    function Timeout(timeout) {
        return _super.call(this, 0, timeout, timeout) || this;
    }
    return Timeout;
}(number_linear_animator_1["default"]));
exports["default"] = Timeout;
