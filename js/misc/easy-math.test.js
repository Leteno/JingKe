"use strict";
exports.__esModule = true;
var easy_math_1 = require("./easy-math");
test("testBetween", function () {
    expect(easy_math_1["default"].between(1, 3, 1)).toBe(true);
    expect(easy_math_1["default"].between(1, 3, 2)).toBe(true);
    expect(easy_math_1["default"].between(1, 3, 3)).toBe(true);
    expect(easy_math_1["default"].between(1, 3, 0)).toBe(false);
    expect(easy_math_1["default"].between(1, 3, 4)).toBe(false);
});
