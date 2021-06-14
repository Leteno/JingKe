"use strict";
exports.__esModule = true;
var Sprite = /** @class */ (function () {
    function Sprite(imgSrc, width, height, x, y, visible) {
        if (imgSrc === void 0) { imgSrc = ''; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (visible === void 0) { visible = true; }
        this.img = new Image();
        this.img.src = imgSrc;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.visible = visible;
    }
    // public final
    Sprite.prototype.drawToCanvas = function (ctx) {
        if (!this.visible)
            return;
        this.drawToCanvasInternal(ctx, this.x, this.y, this.width, this.height);
    };
    // protected
    Sprite.prototype.drawToCanvasInternal = function (ctx, x, y, width, height) {
        ctx.drawImage(this.img, x, y, width, height);
    };
    Sprite.prototype.isCollideWith = function (sp) {
        if (!this.visible || !sp.visible)
            return false;
        var spX = sp.x + sp.width / 2;
        var spY = sp.y + sp.height / 2;
        return !!(spX >= this.x
            && spX <= this.x + this.width
            && spY >= this.y
            && spY <= this.y + this.height);
    };
    return Sprite;
}());
exports["default"] = Sprite;
