"use strict";
exports.__esModule = true;
exports.timestamp = void 0;
function timestamp() {
    return window.performance && window.performance.now ?
        window.performance.now() * 1000 :
        new Date().getTime();
}
exports.timestamp = timestamp;
