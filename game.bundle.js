(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // js/animator/animator_set.js
  var require_animator_set = __commonJS({
    "js/animator/animator_set.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AnimatorSetBuilder = exports.AnimatorSet = void 0;
      var AnimatorSet = class {
        constructor(aList) {
          this.animationList = aList;
          this.currentIdx = 0;
        }
        update(dt) {
          if (this.isStop())
            return;
          let restOfDt = dt;
          while (restOfDt > 0 && !this.isStop()) {
            let currentAnimator = this.animationList[this.currentIdx];
            restOfDt = currentAnimator.update(restOfDt);
            if (currentAnimator.isStop()) {
              this.currentIdx++;
            }
          }
          if (this.isStop()) {
            this.onStop();
          }
          return restOfDt;
        }
        getVal() {
          return this.currentIdx;
        }
        isStop() {
          return this.currentIdx == this.animationList.length;
        }
        onValChange(val) {
        }
        onStop() {
        }
      };
      exports.AnimatorSet = AnimatorSet;
      var AnimatorSetBuilder = class {
        constructor() {
          this.animations = new Array();
        }
        after(animator) {
          this.animations.push(animator);
          return this;
        }
        build() {
          return new AnimatorSet(this.animations);
        }
      };
      exports.AnimatorSetBuilder = AnimatorSetBuilder;
    }
  });

  // js/animator/number-linear-animator.js
  var require_number_linear_animator = __commonJS({
    "js/animator/number-linear-animator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var NumberLinearAnimator = class {
        constructor(start, end, totalTime) {
          this.originalStart = start;
          this.current = start;
          this.end = end;
          this.totalTime = totalTime;
          if (totalTime > 0) {
            this.feet = (end - start) / totalTime;
          } else {
            this.feet = end - start;
          }
          this.stop = false;
        }
        isStop() {
          return this.stop;
        }
        onStop() {
        }
        update(dt) {
          if (this.stop)
            return;
          this.current += this.feet * dt;
          let restOfDt = 0;
          if (this.feet > 0) {
            if (this.current > this.end) {
              restOfDt = this.current - this.end;
              this.current = this.end;
            }
          } else {
            if (this.current < this.end) {
              this.current = this.end;
            }
          }
          this.onValChange(this.current);
          if (this.current === this.end) {
            this.stop = true;
            this.onStop();
          }
          return restOfDt;
        }
        getVal() {
          return this.current;
        }
        onValChange(val) {
        }
        reverse() {
          let properEnd = this.current;
          if (this.current == this.originalStart) {
            properEnd = this.end;
          }
          return new NumberLinearAnimator(properEnd, this.originalStart, this.totalTime);
        }
      };
      exports.default = NumberLinearAnimator;
    }
  });

  // js/animator/text-affect.js
  var require_text_affect = __commonJS({
    "js/animator/text-affect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.textAlpha = void 0;
      var number_linear_animator_1 = require_number_linear_animator();
      function textAlpha(fadeIn, time, textView) {
        let from = 255, to = 0;
        if (fadeIn) {
          from = 0;
          to = 255;
        }
        let fadeInAnimator = new number_linear_animator_1.default(from, to, time);
        if (from == 0)
          textView.visible = true;
        fadeInAnimator.onValChange = (val) => {
          let alpha = Math.floor(val).toString(16);
          if (alpha.length == 1) {
            alpha = "0" + alpha;
          }
          if (val == to && val == 0)
            textView.visible = false;
          let color = `#${alpha}${alpha}${alpha}`;
          textView.textColor = color;
        };
        return fadeInAnimator;
      }
      exports.textAlpha = textAlpha;
    }
  });

  // js/animator/timeout.js
  var require_timeout = __commonJS({
    "js/animator/timeout.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var number_linear_animator_1 = require_number_linear_animator();
      var Timeout = class extends number_linear_animator_1.default {
        constructor(timeout) {
          super(0, timeout, timeout);
        }
      };
      exports.default = Timeout;
    }
  });

  // js/data/dialogue.js
  var require_dialogue = __commonJS({
    "js/data/dialogue.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Dialogue = class {
        constructor(character, content, showAtLeft = true, speed = 20) {
          this.character = character;
          this.content = content;
          this.showAtLeft = showAtLeft;
          this.speed = speed;
        }
      };
      exports.default = Dialogue;
    }
  });

  // js/misc/layout.js
  var require_layout = __commonJS({
    "js/misc/layout.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LayoutParams = exports.Specify = exports.LayoutType = exports.Align = void 0;
      var Align;
      (function(Align2) {
        Align2[Align2["START"] = 0] = "START";
        Align2[Align2["END"] = 1] = "END";
        Align2[Align2["CENTER"] = 2] = "CENTER";
      })(Align = exports.Align || (exports.Align = {}));
      var LayoutType;
      (function(LayoutType2) {
        LayoutType2[LayoutType2["MATCH_PARENT"] = 0] = "MATCH_PARENT";
        LayoutType2[LayoutType2["WRAP_CONTNET"] = 1] = "WRAP_CONTNET";
      })(LayoutType = exports.LayoutType || (exports.LayoutType = {}));
      var Specify;
      (function(Specify2) {
        Specify2[Specify2["NONE"] = 0] = "NONE";
        Specify2[Specify2["X"] = 1] = "X";
        Specify2[Specify2["Y"] = 2] = "Y";
      })(Specify = exports.Specify || (exports.Specify = {}));
      var LayoutParams = class {
        constructor(xcfg, ycfg, xType = LayoutType.WRAP_CONTNET, yType = LayoutType.WRAP_CONTNET) {
          this.xcfg = xcfg;
          this.ycfg = ycfg;
          this.xLayout = xType;
          this.yLayout = yType;
          this.weight = 0;
        }
        static normal() {
          return new LayoutParams(Align.START, Align.START);
        }
      };
      exports.LayoutParams = LayoutParams;
    }
  });

  // js/data/bindable_data.js
  var require_bindable_data = __commonJS({
    "js/data/bindable_data.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BindableData = void 0;
      var BindableData = class {
        constructor() {
          this.dirty = false;
        }
      };
      exports.BindableData = BindableData;
    }
  });

  // js/objects/serializable.js
  var require_serializable = __commonJS({
    "js/objects/serializable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SerializableDemo = exports.BindableAndSerializable = exports.Serializable = void 0;
      var bindable_data_1 = require_bindable_data();
      var Serializable = class {
      };
      exports.Serializable = Serializable;
      var BindableAndSerializable = class extends bindable_data_1.BindableData {
      };
      exports.BindableAndSerializable = BindableAndSerializable;
      var SerializableDemo = class {
        toParcel(p) {
          p.writeString(this.name);
          p.writeInt(this.age);
          p.writeString(this.word);
        }
        fromParcel(p) {
          this.name = p.readString();
          this.age = p.readInt();
          this.word = p.readString();
        }
      };
      exports.SerializableDemo = SerializableDemo;
    }
  });

  // js/misc/assertion.js
  var require_assertion = __commonJS({
    "js/misc/assertion.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Assertion = class {
        static expectTrue(val) {
          if (!val) {
            throw new Error("expectTrue, but get false");
          }
        }
        static expectFalse(val) {
          if (val) {
            throw new Error("expectFalse, but get true");
          }
        }
      };
      exports.default = Assertion;
    }
  });

  // js/special_affect/special_affect.js
  var require_special_affect = __commonJS({
    "js/special_affect/special_affect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SpecialAffect = void 0;
      var serializable_1 = require_serializable();
      var SpecialAffect = class extends serializable_1.Serializable {
        constructor(name, description) {
          super();
          this.name = name;
          this.description = description;
        }
        toParcel(p) {
          p.writeString(this.name);
          p.writeString(this.description);
        }
        fromParcel(p) {
          this.name = p.readString();
          this.description = p.readString();
        }
      };
      exports.SpecialAffect = SpecialAffect;
    }
  });

  // js/special_affect/goods_affect.js
  var require_goods_affect = __commonJS({
    "js/special_affect/goods_affect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GoodsAffectFactory = exports.Goods_Type = exports.GoodsAffect = void 0;
      var assertion_1 = require_assertion();
      var special_affect_1 = require_special_affect();
      var GoodsAffect = class extends special_affect_1.SpecialAffect {
      };
      exports.GoodsAffect = GoodsAffect;
      var GACostDiscount = class extends GoodsAffect {
        constructor(name, description, costDiscount) {
          super(name, description);
          this.costDiscount = costDiscount;
        }
        affect(data) {
          data.cost = Math.round(data.cost * this.costDiscount);
          return true;
        }
        toParcel(p) {
          super.toParcel(p);
          p.writeDouble(this.costDiscount);
        }
        fromParcel(p) {
          super.fromParcel(p);
          this.costDiscount = p.readDouble();
        }
      };
      var GACountChange = class extends GoodsAffect {
        constructor(name, description, countDelta) {
          super(name, description);
          this.countDelta = countDelta;
        }
        affect(data) {
          data.count += this.countDelta;
          if (data.count < 0) {
            data.count = 0;
          }
          return true;
        }
        toParcel(p) {
          super.toParcel(p);
          p.writeInt(this.countDelta);
        }
        fromParcel(p) {
          super.fromParcel(p);
          this.countDelta = p.readInt();
        }
      };
      var Goods_Type;
      (function(Goods_Type2) {
        Goods_Type2[Goods_Type2["GACostDiscount"] = 0] = "GACostDiscount";
        Goods_Type2[Goods_Type2["GACountChange"] = 1] = "GACountChange";
      })(Goods_Type = exports.Goods_Type || (exports.Goods_Type = {}));
      var GoodsAffectFactory = class {
        static getGoodsAffect(t, ...args) {
          switch (t) {
            case Goods_Type.GACostDiscount:
              assertion_1.default.expectTrue(args.length == 3);
              return new GACostDiscount(args[0], args[1], args[2]);
            case Goods_Type.GACountChange:
              assertion_1.default.expectTrue(args.length == 3);
              return new GACountChange(args[0], args[1], args[2]);
          }
          return null;
        }
        static toParcel(sp, p) {
          if (sp instanceof GACostDiscount) {
            p.writeInt(Goods_Type.GACostDiscount);
            sp.toParcel(p);
          } else if (sp instanceof GACountChange) {
            p.writeInt(Goods_Type.GACountChange);
            sp.toParcel(p);
          }
        }
        static fromParcel(p) {
          let type = p.readInt();
          switch (type) {
            case Goods_Type.GACostDiscount: {
              let ret = new GACostDiscount("", "", 0);
              ret.fromParcel(p);
              return ret;
            }
            case Goods_Type.GACountChange: {
              let ret = new GACountChange("", "", 0);
              ret.fromParcel(p);
              return ret;
            }
          }
          return null;
        }
      };
      exports.GoodsAffectFactory = GoodsAffectFactory;
    }
  });

  // js/special_affect/label_affect.js
  var require_label_affect = __commonJS({
    "js/special_affect/label_affect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LabelAffectFactory = exports.LabelAffect = exports.Label_Type = void 0;
      var assertion_1 = require_assertion();
      var special_affect_1 = require_special_affect();
      var Label_Type;
      (function(Label_Type2) {
        Label_Type2[Label_Type2["SimpleAndNaive"] = 0] = "SimpleAndNaive";
        Label_Type2[Label_Type2["Brave"] = 1] = "Brave";
        Label_Type2[Label_Type2["Xianting"] = 2] = "Xianting";
        Label_Type2[Label_Type2["Yiboyuntian"] = 3] = "Yiboyuntian";
      })(Label_Type = exports.Label_Type || (exports.Label_Type = {}));
      var LabelAffect = class extends special_affect_1.SpecialAffect {
        constructor(name, description, type) {
          super(name, description);
          this.type = type;
        }
      };
      exports.LabelAffect = LabelAffect;
      var LabelAffectFactory = class {
        static getLabelAffect(t, ...args) {
          assertion_1.default.expectTrue(args.length == 0);
          let name, desc;
          switch (t) {
            case Label_Type.SimpleAndNaive:
              name = "\u6734\u7D20";
              desc = "\u5F88\u6734\u7D20\uFF0C\u4E0D\u77E5\u9053\u672A\u6765\u6709\u6CA1\u6709\u5947\u9047";
              break;
            case Label_Type.Brave:
              name = "\u52C7\u6562";
              desc = "\u9047\u5230\u653B\u51FB\u529B\u6BD4\u81EA\u5DF1\u9AD8\u7684\uFF0C\u653B\u51FB\u529B+3";
              break;
            case Label_Type.Xianting:
              name = "\u95F2\u5EAD";
              desc = "\u7531\u4E8E\u4F60\u7684\u6B65\u4F10\u8FC7\u4E8E\u51B7\u9759\uFF0C\u6B63\u5E38\u60C5\u51B5\u4E0B\u4E0D\u4F1A\u906D\u9047\u6355\u5FEB";
              break;
            case Label_Type.Yiboyuntian:
              name = "\u4E49\u8584\u4E91\u5929";
              desc = "\u4EFB\u4F55\u4E49\u58EB\u9047\u5230\u56F0\u96BE\uFF0C\u4F60\u90FD\u4F1A\u4F38\u51FA\u63F4\u624B";
              break;
            default:
              console.log("unresolve type: " + t);
          }
          assertion_1.default.expectTrue(name != void 0);
          assertion_1.default.expectTrue(desc != void 0);
          return new LabelAffect(name, desc, t);
        }
        static toParcel(sp, p) {
          p.writeInt(sp.type);
        }
        static fromParcel(p) {
          let type = p.readInt();
          return this.getLabelAffect(type);
        }
      };
      exports.LabelAffectFactory = LabelAffectFactory;
    }
  });

  // js/special_affect/special_affect_parcel_factory.js
  var require_special_affect_parcel_factory = __commonJS({
    "js/special_affect/special_affect_parcel_factory.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var goods_affect_1 = require_goods_affect();
      var label_affect_1 = require_label_affect();
      var AffectType;
      (function(AffectType2) {
        AffectType2[AffectType2["Unknown"] = 0] = "Unknown";
        AffectType2[AffectType2["GoodsAffect"] = 1] = "GoodsAffect";
        AffectType2[AffectType2["LabelAffect"] = 2] = "LabelAffect";
      })(AffectType || (AffectType = {}));
      var SpecialAffectParcelFactory = class {
        static toParcel(sp, p) {
          if (sp instanceof goods_affect_1.GoodsAffect) {
            p.writeInt(AffectType.GoodsAffect);
            goods_affect_1.GoodsAffectFactory.toParcel(sp, p);
          } else if (sp instanceof label_affect_1.LabelAffect) {
            p.writeInt(AffectType.LabelAffect);
            label_affect_1.LabelAffectFactory.toParcel(sp, p);
          } else {
            sp.toParcel(p);
          }
        }
        static fromParcel(p) {
          let type = p.readInt();
          if (type == AffectType.GoodsAffect) {
            return goods_affect_1.GoodsAffectFactory.fromParcel(p);
          }
          if (type == AffectType.LabelAffect) {
            return label_affect_1.LabelAffectFactory.fromParcel(p);
          }
        }
      };
      exports.default = SpecialAffectParcelFactory;
    }
  });

  // js/data/character.js
  var require_character = __commonJS({
    "js/data/character.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Character = exports.ABILITY = void 0;
      var serializable_1 = require_serializable();
      var special_affect_parcel_factory_1 = require_special_affect_parcel_factory();
      var ABILITY;
      (function(ABILITY2) {
        ABILITY2[ABILITY2["LOYAL"] = 0] = "LOYAL";
        ABILITY2[ABILITY2["ATTACK"] = 1] = "ATTACK";
        ABILITY2[ABILITY2["INTELIGENCE"] = 2] = "INTELIGENCE";
        ABILITY2[ABILITY2["TRUST"] = 3] = "TRUST";
      })(ABILITY = exports.ABILITY || (exports.ABILITY = {}));
      var Character = class extends serializable_1.BindableAndSerializable {
        constructor() {
          super();
          this.abilities = new Array();
          this.specials = new Array();
          this.abilities[ABILITY.ATTACK] = 0;
          this.abilities[ABILITY.INTELIGENCE] = 0;
          this.abilities[ABILITY.LOYAL] = 0;
          this.abilities[ABILITY.TRUST] = 0;
        }
        toParcel(p) {
          p.writeString(this.name);
          p.writeString(this.imageSrc);
          p.writeNumberArray(this.abilities);
          p.writeInt(this.specials.length);
          this.specials.forEach((sp) => {
            special_affect_parcel_factory_1.default.toParcel(sp, p);
          });
        }
        fromParcel(p) {
          this.name = p.readString();
          this.imageSrc = p.readString();
          this.abilities = p.readNumberArray();
          let specialLen = p.readInt();
          this.specials = [];
          for (let i = 0; i < specialLen; i++) {
            this.specials.push(special_affect_parcel_factory_1.default.fromParcel(p));
          }
        }
      };
      exports.Character = Character;
    }
  });

  // js/game/data/styles/colors.js
  var require_colors = __commonJS({
    "js/game/data/styles/colors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Colors = class {
      };
      exports.default = Colors;
      Colors.black = "#000000";
      Colors.white = "#ffffff";
      Colors.winBlue = "#2198dc";
      Colors.winBlueDeep = "#075cac";
      Colors.winGrey = "#f6f6f6";
      Colors.winGreyDeep = "#f3f3f3";
    }
  });

  // js/widgets/richtext.js
  var require_richtext = __commonJS({
    "js/widgets/richtext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BgText = void 0;
      var layout_1 = require_layout();
      var BgText = class {
        constructor(bgColor, textColor, align = layout_1.Align.CENTER) {
          this.bgColor = bgColor;
          this.textColor = textColor;
          this.align = align;
        }
        draw(ctx, x, y, width, height, text) {
          ctx.save();
          let lastWidth = width;
          let lastHeight = height;
          let ratio = 4 / 5;
          width *= ratio;
          height *= ratio;
          switch (this.align) {
            case layout_1.Align.CENTER:
              x = x + (lastWidth - width) / 2;
              break;
            case layout_1.Align.START:
              break;
            case layout_1.Align.END:
              x = x + (lastWidth - width);
              break;
          }
          y = y + (lastHeight - height) / 2;
          if (this.bgColor) {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(x, y, width, height);
          }
          ctx.restore();
          ctx.save();
          ctx.font = `${height - 1}px bold`;
          if (this.textColor) {
            ctx.fillStyle = this.textColor;
          }
          ctx.fillText(text, x, y);
          ctx.restore();
        }
      };
      exports.BgText = BgText;
    }
  });

  // js/game/data/styles/text_effects.js
  var require_text_effects = __commonJS({
    "js/game/data/styles/text_effects.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var richtext_1 = require_richtext();
      var TextEffects = class {
        static init() {
          this.abilityEffect = new richtext_1.BgText("green", "white");
          this.goodsEffect = new richtext_1.BgText("white", "black");
          this.labelEffect = new richtext_1.BgText("white", "black");
          this.nameEffect = new richtext_1.BgText("green", "black");
          this.placeEffect = new richtext_1.BgText("white", "black");
          this.specialEffect = new richtext_1.BgText("white", "black");
        }
      };
      exports.default = TextEffects;
    }
  });

  // js/misc/easy-math.js
  var require_easy_math = __commonJS({
    "js/misc/easy-math.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var EasyMath = class {
        static between(from, to, test) {
          return from <= test && to >= test;
        }
      };
      exports.default = EasyMath;
    }
  });

  // js/widgets/sprite.js
  var require_sprite = __commonJS({
    "js/widgets/sprite.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Border = exports.MeasureResult = void 0;
      var easy_math_1 = require_easy_math();
      var layout_1 = require_layout();
      var MeasureResult = class {
      };
      exports.MeasureResult = MeasureResult;
      var Border = class {
      };
      exports.Border = Border;
      var _Gap = class {
        constructor() {
          this.left = 0;
          this.top = 0;
          this.right = 0;
          this.bottom = 0;
        }
      };
      var Sprite = class {
        constructor(layoutParam = layout_1.LayoutParams.normal(), visible = true) {
          this.layoutParam = layoutParam;
          this.visible = visible;
          this.debug = false;
          this.debugColor = "blue";
          this.enable = true;
          this.forceWidth = -1;
          this.forceHeight = -1;
          this.width = this.height = 0;
          this.x = this.y = 0;
          this.margin = new _Gap();
          this.padding = new _Gap();
        }
        isCollideWith(sp) {
          if (!this.visible || !sp.visible)
            return false;
          const spX = sp.x + sp.width / 2;
          const spY = sp.y + sp.height / 2;
          return !!(spX >= this.x && spX <= this.x + this.width && spY >= this.y && spY <= this.y + this.height);
        }
        onclick(event) {
          if (!this.enable)
            return false;
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            if (this.onTouchOutside(event)) {
              return true;
            }
            return false;
          }
          return this.onclickInternal(event);
        }
        onclickInternal(event) {
          return false;
        }
        onpress(event) {
          if (!this.enable)
            return false;
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            return false;
          }
          return this.onpressInternal(event);
        }
        onpressInternal(event) {
          return false;
        }
        ondrag(event) {
          if (!this.enable)
            return false;
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            return false;
          }
          return this.ondragInternal(event);
        }
        ondragInternal(event) {
          return false;
        }
        onTouchOutside(event) {
          return false;
        }
      };
      exports.default = Sprite;
    }
  });

  // js/widgets/layout_cache.js
  var require_layout_cache = __commonJS({
    "js/widgets/layout_cache.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var layout_1 = require_layout();
      var sprite_1 = require_sprite();
      var MeasureParams = class {
        constructor() {
          this.maxWidth = -1;
          this.maxHeight = -1;
        }
        setParams(maxWidth, maxHeight) {
          this.maxWidth = maxWidth;
          this.maxHeight = maxHeight;
        }
        isDifferent(maxWidth, maxHeight) {
          return this.maxWidth != maxWidth || this.maxHeight != maxHeight;
        }
      };
      var LayoutParams = class {
        constructor() {
          this.parentWidth = -1;
          this.parentHeight = -1;
          this.left = -1;
          this.top = -1;
        }
        setParams(parentWidth, parentHeight, left, top) {
          this.parentWidth = parentWidth;
          this.parentHeight = parentHeight;
          this.left = left;
          this.top = top;
        }
        isDifferent(parentWidth, parentHeight, left, top) {
          return this.parentWidth != parentWidth || this.parentHeight != parentHeight || this.left != left || this.top != top;
        }
      };
      var LayoutCache = class {
        constructor() {
          this.measureParams = new MeasureParams();
          this.measureResult = new sprite_1.MeasureResult();
          this.layoutParams = new LayoutParams();
          this.dirty = false;
        }
        measureParamsChanged(maxWidth, maxHeight) {
          return this.measureParams.isDifferent(maxWidth, maxHeight);
        }
        saveMeasureParams(maxWidth, maxHeight) {
          this.measureParams.setParams(maxWidth, maxHeight);
        }
        saveMeasureResult(result) {
          this.measureResult.calcWidth = result.calcWidth;
          this.measureResult.calcHeight = result.calcHeight;
        }
        getMeasureResult() {
          return {
            calcWidth: this.measureResult.calcWidth,
            calcHeight: this.measureResult.calcHeight
          };
        }
        reMeasure(view, ctx) {
          view.measure(ctx, this.measureParams.maxWidth, this.measureParams.maxHeight, layout_1.Specify.NONE);
        }
        layoutParamsChanged(parentWidth, parentHeight, left, top) {
          return this.layoutParams.isDifferent(parentWidth, parentHeight, left, top);
        }
        saveLayoutParams(parentWidth, parentHeight, left, top) {
          this.layoutParams.setParams(parentWidth, parentHeight, left, top);
        }
        reLayout(view) {
          view.layout(this.layoutParams.parentWidth, this.layoutParams.parentHeight, this.layoutParams.left, this.layoutParams.top);
        }
        isDirty() {
          return this.dirty;
        }
        setIsDirty(dirty) {
          this.dirty = dirty;
        }
      };
      exports.default = LayoutCache;
    }
  });

  // js/widgets/simple_view.js
  var require_simple_view = __commonJS({
    "js/widgets/simple_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var layout_1 = require_layout();
      var layout_cache_1 = require_layout_cache();
      var sprite_1 = require_sprite();
      var SimpleView = class extends sprite_1.default {
        constructor() {
          super();
          this.layoutCache = new layout_cache_1.default();
          this.isMeasured = false;
          this.isLayouted = false;
        }
        measure(ctx, maxWidth, maxHeight, specify) {
          if (!this.layoutCache.measureParamsChanged(maxWidth, maxHeight) && !this.layoutCache.isDirty()) {
            return this.layoutCache.getMeasureResult();
          }
          this.layoutCache.saveMeasureParams(maxWidth, maxHeight);
          maxWidth = maxWidth - this.getLandscapeMargin();
          maxHeight = maxHeight - this.getPortraitMargin();
          let width = 0;
          let height = 0;
          if (this.layoutParam.xLayout == layout_1.LayoutType.MATCH_PARENT || specify & layout_1.Specify.X) {
            width = maxWidth;
          } else if (this.forceWidth > 0) {
            width = Math.min(this.forceWidth, maxWidth);
          }
          if (this.layoutParam.yLayout == layout_1.LayoutType.MATCH_PARENT || specify & layout_1.Specify.Y) {
            height = maxHeight;
          } else if (this.forceHeight > 0) {
            height = Math.min(this.forceHeight, maxHeight);
          }
          let specifiedX = width > 0;
          let specifiedY = height > 0;
          if (!specifiedX) {
            width = maxWidth;
          }
          if (!specifiedY) {
            height = maxHeight;
          }
          let measureResult = this.calculateActualSize(ctx, width - this.padding.left - this.padding.right, height - this.padding.top - this.padding.bottom);
          if (specifiedX) {
            this.width = width;
          } else {
            this.width = measureResult.calcWidth + this.padding.left + this.padding.right;
          }
          if (specifiedY) {
            this.height = height;
          } else {
            this.height = measureResult.calcHeight + this.padding.top + this.padding.bottom;
          }
          let result = {
            calcWidth: this.width + this.getLandscapeMargin(),
            calcHeight: this.height + this.getPortraitMargin()
          };
          this.layoutCache.saveMeasureResult(result);
          this.isMeasured = true;
          return result;
        }
        getLandscapeMargin() {
          let ret = this.margin.left + this.margin.right;
          if (layout_1.Align.CENTER == this.layoutParam.xcfg) {
            ret = Math.max(this.margin.left, this.margin.right) * 2;
          }
          return ret;
        }
        getPortraitMargin() {
          let ret = this.margin.top + this.margin.bottom;
          if (layout_1.Align.CENTER == this.layoutParam.ycfg) {
            ret = Math.max(this.margin.top, this.margin.bottom) * 2;
          }
          return ret;
        }
        layout(parentWidth, parentHeight, left = 0, top = 0) {
          if (!this.layoutCache.layoutParamsChanged(parentWidth, parentHeight, left, top) && !this.layoutCache.isDirty()) {
            return;
          }
          this.layoutCache.saveLayoutParams(parentWidth, parentHeight, left, top);
          switch (this.layoutParam.xcfg) {
            case layout_1.Align.CENTER:
              this.x = left + (parentWidth - this.width) / 2 + this.margin.left - this.margin.right;
              break;
            case layout_1.Align.END:
              this.x = left + parentWidth - this.width - this.margin.right;
              break;
            default:
              this.x = left + this.margin.left;
              break;
          }
          switch (this.layoutParam.ycfg) {
            case layout_1.Align.CENTER:
              this.y = top + (parentHeight - this.height) / 2 + this.margin.top - this.margin.bottom;
              break;
            case layout_1.Align.END:
              this.y = top + parentHeight - this.height - this.margin.bottom;
              break;
            default:
              this.y = top + this.margin.top;
              break;
          }
          this.isLayouted = true;
          this.onLayout(parentWidth, parentHeight, left, top);
        }
        drawToCanvas(ctx) {
          if (!this.visible)
            return;
          if (this.bindedData && this.onBind && this.bindedData.dirty) {
            this.onBind(this, this.bindedData);
            this.bindedData.dirty = false;
          }
          if (this.layoutCache.isDirty()) {
            this.layoutCache.reMeasure(this, ctx);
            this.layoutCache.reLayout(this);
            this.layoutCache.setIsDirty(false);
          }
          ctx.save();
          ctx.translate(this.x, this.y);
          let bgColor = this.bgColor;
          if (!this.enable && this.disableBgColor != void 0) {
            bgColor = this.disableBgColor;
          }
          if (bgColor) {
            ctx.save();
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
          }
          if (this.debug) {
            ctx.save();
            ctx.fillStyle = this.debugColor;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
          }
          if (this.border) {
            let borderColor = this.border.color ? this.border.color : "white";
            ctx.save();
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(0, 0, this.width, this.height);
            ctx.restore();
          }
          this.drawToCanvasInternal(ctx);
          ctx.restore();
        }
        setIsDirty(dirty) {
          this.layoutCache.setIsDirty(dirty);
        }
        setPadding(padding) {
          this.padding.left = this.padding.right = this.padding.top = this.padding.bottom = padding;
        }
        isReady() {
          return this.isMeasured && this.isLayouted;
        }
        bindData(data, fn) {
          this.bindedData = data;
          this.onBind = fn;
          this.onBind(this, data);
        }
      };
      exports.default = SimpleView;
    }
  });

  // js/widgets/imageview.js
  var require_imageview = __commonJS({
    "js/widgets/imageview.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PointerPosition = void 0;
      var simple_view_1 = require_simple_view();
      var PointerPosition;
      (function(PointerPosition2) {
        PointerPosition2[PointerPosition2["NONE"] = 0] = "NONE";
        PointerPosition2[PointerPosition2["LEFT"] = 1] = "LEFT";
        PointerPosition2[PointerPosition2["RIGHT"] = 2] = "RIGHT";
      })(PointerPosition = exports.PointerPosition || (exports.PointerPosition = {}));
      var ImageView = class extends simple_view_1.default {
        constructor(imgSrc) {
          super();
          this.img = new Image();
          this.img.src = imgSrc;
          this.pointerPosition = PointerPosition.NONE;
          this.showNoteSign = false;
        }
        static drawPointer(ctx, pointerPosition, view) {
          if (pointerPosition == PointerPosition.NONE) {
            return;
          }
          if (ImageView.pointer == null) {
            ImageView.pointer = new Image();
            ImageView.pointer.src = "res/created/pointer.png";
          }
          let pointerSize = 30;
          let dy = (view.height - pointerSize) / 2;
          ctx.save();
          if (pointerPosition == PointerPosition.RIGHT) {
            let dx = view.x + view.width + pointerSize;
            ctx.translate(dx, dy);
            ctx.scale(-1, 1);
          } else {
            let dx = -pointerSize / 2 - 8;
            ctx.translate(dx, dy);
          }
          ctx.drawImage(ImageView.pointer, 0, 0, pointerSize, pointerSize);
          ctx.restore();
        }
        static drawNoteSign(ctx, view) {
          if (!view.showNoteSign) {
            return;
          }
          if (ImageView.noteSign == null) {
            ImageView.noteSign = new Image();
            ImageView.noteSign.src = "res/created/note_sign.png";
          }
          ctx.save();
          let size = 30;
          ctx.drawImage(ImageView.noteSign, view.width - size, 0, size, size);
          ctx.restore();
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          return {
            calcWidth: this.img.naturalWidth,
            calcHeight: this.img.naturalHeight
          };
        }
        onLayout(parentWidth, parentHeight) {
        }
        drawToCanvasInternal(ctx) {
          ctx.drawImage(this.img, 0, 0, this.width, this.height);
          ImageView.drawPointer(ctx, this.pointerPosition, this);
          ImageView.drawNoteSign(ctx, this);
        }
        isReady() {
          return super.isReady() && this.img && this.img.complete;
        }
      };
      exports.default = ImageView;
    }
  });

  // js/misc/event.js
  var require_event = __commonJS({
    "js/misc/event.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DragEvent = exports.PressEvent = exports.ClickEvent = void 0;
      var ClickEvent = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        static from(pEvent) {
          return new ClickEvent(pEvent.offsetX, pEvent.offsetY);
        }
        static alignChildren(event, view) {
          let ret = new ClickEvent(event.x, event.y);
          ret.x -= view.x + view.padding.left;
          ret.y -= view.y + view.padding.top;
          return ret;
        }
      };
      exports.ClickEvent = ClickEvent;
      var PressEvent = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        static from(pEvent) {
          return new PressEvent(pEvent.offsetX, pEvent.offsetY);
        }
        static alignChildren(event, view) {
          let ret = new PressEvent(event.x, event.y);
          ret.x -= view.x + view.padding.left;
          ret.y -= view.y + view.padding.top;
          return ret;
        }
      };
      exports.PressEvent = PressEvent;
      var DragEvent = class {
        constructor(startX, startY, dragX, dragY, startTime) {
          this.x = startX;
          this.y = startY;
          this.dragX = dragX;
          this.dragY = dragY;
          this.startTime = startTime;
        }
        static alignChildren(event, view) {
          let ret = new DragEvent(event.x, event.y, event.dragX, event.dragY, event.startTime);
          ret.x -= view.x + view.padding.left;
          ret.y -= view.y + view.padding.top;
          return ret;
        }
      };
      exports.DragEvent = DragEvent;
    }
  });

  // js/widgets/panel.js
  var require_panel = __commonJS({
    "js/widgets/panel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var easy_math_1 = require_easy_math();
      var layout_1 = require_layout();
      var event_1 = require_event();
      var simple_view_1 = require_simple_view();
      var Panel = class extends simple_view_1.default {
        constructor() {
          super();
          this.children = new Array();
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          let childWidthAtMost = 0;
          let childHeightAtMost = 0;
          this.children.forEach((view) => {
            let size = view.measure(ctx, maxWidthForCalculation, maxHeightForCalculation, layout_1.Specify.NONE);
            childWidthAtMost = Math.max(size.calcWidth, childWidthAtMost);
            childHeightAtMost = Math.max(size.calcHeight, childHeightAtMost);
          });
          return {
            calcWidth: childWidthAtMost,
            calcHeight: childHeightAtMost
          };
        }
        onLayout(parentWidth, parentHeight) {
          this.children.forEach((view) => {
            view.layout(this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom, 0, 0);
          });
        }
        addView(view) {
          this.children.push(view);
        }
        indexOf(view) {
          let result = -1;
          for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] == view) {
              result = i;
              break;
            }
          }
          return result;
        }
        removeView(view) {
          let index = this.children.findIndex((v) => v == view);
          if (index !== -1) {
            this.children.splice(index, 1);
          }
        }
        removeAllViews() {
          this.children.splice(0);
        }
        isReady() {
          if (super.isReady()) {
            for (let i = 0; i < this.children.length; i++) {
              if (!this.children[i].isReady()) {
                return false;
              }
            }
            return true;
          }
          return false;
        }
        drawToCanvasInternal(ctx) {
          ctx.save();
          ctx.translate(this.padding.left, this.padding.top);
          this.children.forEach((view) => {
            view.drawToCanvas(ctx);
          });
          ctx.restore();
        }
        onclick(event) {
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            if (this.onTouchOutside(event)) {
              return true;
            }
            return false;
          }
          let childEvent = event_1.ClickEvent.alignChildren(event, this);
          this.specialModifyOnEvent(childEvent);
          for (let i = this.children.length - 1; i >= 0; i--) {
            let view = this.children[i];
            if (view.onclick(childEvent)) {
              return true;
            }
          }
          return this.onclickInternal(event);
        }
        onpress(event) {
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            return false;
          }
          let childEvent = event_1.PressEvent.alignChildren(event, this);
          this.specialModifyOnEvent(childEvent);
          for (let i = this.children.length - 1; i >= 0; i--) {
            let view = this.children[i];
            if (view.onpress(childEvent)) {
              return true;
            }
          }
          return this.onpressInternal(event);
        }
        ondrag(event) {
          if (!this.visible)
            return false;
          let inside = easy_math_1.default.between(this.x, this.x + this.width, event.x) && easy_math_1.default.between(this.y, this.y + this.height, event.y);
          if (!inside) {
            return false;
          }
          let childEvent = event_1.DragEvent.alignChildren(event, this);
          this.specialModifyOnEvent(childEvent);
          for (let i = this.children.length - 1; i >= 0; i--) {
            let view = this.children[i];
            if (view.ondrag(childEvent)) {
              return true;
            }
          }
          return this.ondragInternal(event);
        }
        specialModifyOnEvent(event) {
        }
      };
      exports.default = Panel;
    }
  });

  // js/widgets/linear_layout.js
  var require_linear_layout = __commonJS({
    "js/widgets/linear_layout.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Orientation = void 0;
      var layout_1 = require_layout();
      var panel_1 = require_panel();
      var Orientation;
      (function(Orientation2) {
        Orientation2[Orientation2["HORIZONTAL"] = 0] = "HORIZONTAL";
        Orientation2[Orientation2["VERTICAL"] = 1] = "VERTICAL";
      })(Orientation = exports.Orientation || (exports.Orientation = {}));
      var LinearLayout = class extends panel_1.default {
        constructor(orientation = Orientation.VERTICAL) {
          super();
          this.orientation = orientation;
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          if (this.orientation == Orientation.VERTICAL) {
            return this.measureVertical(ctx, maxWidthForCalculation, maxHeightForCalculation);
          } else {
            return this.measureHorizontal(ctx, maxWidthForCalculation, maxHeightForCalculation);
          }
        }
        measureVertical(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          let childWidthAtMost = 0;
          let currentHeight = 0;
          let totalWeight = 0;
          let weightViews = new Array();
          for (let i = 0; i < this.children.length; i++) {
            let view = this.children[i];
            if (view.layoutParam.weight > 0) {
              weightViews.push(view);
              totalWeight += view.layoutParam.weight;
              continue;
            }
            let size = view.measure(ctx, maxWidthForCalculation, maxHeightForCalculation, layout_1.Specify.NONE);
            childWidthAtMost = Math.max(size.calcWidth, childWidthAtMost);
            currentHeight += size.calcHeight;
          }
          ;
          let restOfHeight = maxHeightForCalculation - currentHeight;
          if (weightViews.length <= 0 || restOfHeight <= 0) {
            return {
              calcWidth: childWidthAtMost,
              calcHeight: currentHeight
            };
          }
          weightViews.forEach((view) => {
            let h = view.layoutParam.weight * restOfHeight / totalWeight;
            let size = view.measure(ctx, maxWidthForCalculation, h, layout_1.Specify.Y);
            childWidthAtMost = Math.max(size.calcWidth, childWidthAtMost);
          });
          return {
            calcWidth: childWidthAtMost,
            calcHeight: maxHeightForCalculation
          };
        }
        measureHorizontal(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          let childHeightAtMost = 0;
          let currentWidth = 0;
          let totalWeight = 0;
          let weightViews = new Array();
          for (let i = 0; i < this.children.length; i++) {
            let view = this.children[i];
            if (view.layoutParam.weight > 0) {
              weightViews.push(view);
              totalWeight += view.layoutParam.weight;
              continue;
            }
            let size = view.measure(ctx, maxWidthForCalculation, maxHeightForCalculation, layout_1.Specify.NONE);
            childHeightAtMost = Math.max(size.calcHeight, childHeightAtMost);
            currentWidth += size.calcWidth;
          }
          ;
          let restOfWidth = maxWidthForCalculation - currentWidth;
          if (weightViews.length <= 0 || restOfWidth <= 0) {
            return {
              calcWidth: currentWidth,
              calcHeight: childHeightAtMost
            };
          }
          weightViews.forEach((view) => {
            let w = view.layoutParam.weight * restOfWidth / totalWeight;
            let size = view.measure(ctx, w, maxHeightForCalculation, layout_1.Specify.X);
            childHeightAtMost = Math.max(size.calcHeight, childHeightAtMost);
          });
          return {
            calcWidth: maxWidthForCalculation,
            calcHeight: childHeightAtMost
          };
        }
        onLayout(parentWidth, parentHeight) {
          if (this.orientation == Orientation.VERTICAL) {
            this.layoutVertical(parentWidth, parentHeight);
          } else {
            this.layoutHorizontal(parentWidth, parentHeight);
          }
        }
        layoutVertical(parentWidth, parentHeight) {
          let left = 0, top = 0;
          this.children.forEach((view) => {
            view.layout(this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom, left, top);
            top += view.margin.top + view.height + view.margin.bottom;
          });
        }
        layoutHorizontal(parentWidth, parentHeight) {
          let left = 0, top = 0;
          this.children.forEach((view) => {
            view.layout(this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom, left, top);
            left += view.margin.left + view.width + view.margin.right;
          });
        }
      };
      exports.default = LinearLayout;
    }
  });

  // js/widgets/textview_state_machine.js
  var require_textview_state_machine = __commonJS({
    "js/widgets/textview_state_machine.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DrawItem = void 0;
      var State;
      (function(State2) {
        State2[State2["Normal"] = 0] = "Normal";
        State2[State2["NormalEndswithLetter"] = 1] = "NormalEndswithLetter";
        State2[State2["PatternMode"] = 2] = "PatternMode";
      })(State || (State = {}));
      var DrawItem = class {
        constructor(x, y, width, height, startIndex, endIndex, text, isPattern = false) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.startIndex = startIndex;
          this.endIndex = endIndex;
          this.text = text;
          this.isPattern = isPattern;
        }
      };
      exports.DrawItem = DrawItem;
      var TextViewStateMachine = class {
        constructor() {
          this.result = [];
        }
        output() {
          return this.result;
        }
        parse(text, lineHeight, maxWidth, chineseLetterSize, englishLetterSize) {
          let x = 0, y = 0;
          let currentXOffset = 0;
          let textStartIndex = 0;
          let widthWhenletterStart = 0;
          let letterTextStartIndex = 0;
          let state = State.Normal;
          for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i);
            let chCode = text.charCodeAt(i);
            let isChinese = chCode > 512;
            let chSize = isChinese ? chineseLetterSize : englishLetterSize;
            if (ch == "\f") {
              this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, i - 1, text.substr(textStartIndex, i - textStartIndex));
              x = currentXOffset;
              textStartIndex = i + 1;
              state = State.PatternMode;
              continue;
            }
            switch (state) {
              case State.Normal:
                if (currentXOffset + chSize > maxWidth || ch == "\n") {
                  this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, i - 1, text.substr(textStartIndex, i - textStartIndex));
                  x = 0;
                  y += lineHeight;
                  currentXOffset = 0;
                  textStartIndex = i;
                }
                if (ch == "\n") {
                  textStartIndex = i + 1;
                  continue;
                }
                if (!isChinese) {
                  state = State.NormalEndswithLetter;
                  widthWhenletterStart = currentXOffset;
                  letterTextStartIndex = i;
                }
                currentXOffset += chSize;
                break;
              case State.NormalEndswithLetter:
                if (currentXOffset + chSize > maxWidth || ch == "\n") {
                  if (isChinese || ch == " " || ch == "," || ch == "." || ch == "\uFF0C" || ch == "\u3002" || ch == "\n") {
                    this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, i - 1, text.substr(textStartIndex, i - textStartIndex));
                    x = 0;
                    y += lineHeight;
                    currentXOffset = 0;
                    textStartIndex = i;
                    if (ch == "\n") {
                      textStartIndex = i + 1;
                    }
                  } else {
                    this.outputDrawItem(x, y, widthWhenletterStart - x, lineHeight, textStartIndex, letterTextStartIndex - 1, text.substr(textStartIndex, letterTextStartIndex - textStartIndex));
                    x = 0;
                    y += lineHeight;
                    currentXOffset = currentXOffset - widthWhenletterStart;
                    textStartIndex = letterTextStartIndex;
                  }
                }
                if (isChinese || ch == " " || ch == "," || ch == "." || ch == "\uFF0C" || ch == "\u3002" || ch == "\n") {
                  state = State.Normal;
                }
                currentXOffset += chSize;
                break;
              case State.PatternMode:
                if (currentXOffset + chSize > maxWidth) {
                  this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, i - 1, text.substr(textStartIndex, i - textStartIndex), true);
                  x = 0;
                  y += lineHeight;
                  currentXOffset = 0;
                  textStartIndex = i;
                }
                if (ch == "\r") {
                  if (textStartIndex < i) {
                    this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, i - 1, text.substr(textStartIndex, i - textStartIndex), true);
                  }
                  state = State.Normal;
                  textStartIndex = i + 1;
                  x = currentXOffset;
                  break;
                }
                currentXOffset += chSize;
                break;
            }
          }
          if (textStartIndex < text.length) {
            this.outputDrawItem(x, y, currentXOffset - x, lineHeight, textStartIndex, text.length - 1, text.substr(textStartIndex, text.length - textStartIndex));
          }
          this.maxHeight = y + lineHeight;
          if (this.maxHeight > lineHeight) {
            this.maxWidth = maxWidth;
          } else {
            this.maxWidth = currentXOffset;
          }
        }
        outputDrawItem(x, y, width, height, startIndex, endIndex, text, isPattern = false) {
          let ret = new DrawItem(x, y, width, height, startIndex, endIndex, text, isPattern);
          this.result.push(ret);
        }
      };
      exports.default = TextViewStateMachine;
    }
  });

  // js/widgets/text_helper.js
  var require_text_helper = __commonJS({
    "js/widgets/text_helper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TextHelper = void 0;
      var TextHelper = class {
        constructor() {
          this.storeMap = /* @__PURE__ */ new Map();
          this.chineseSizeMap = /* @__PURE__ */ new Map();
          this.englishSizeMap = /* @__PURE__ */ new Map();
        }
        static getInstance() {
          if (this.instance == null) {
            this.instance = new TextHelper();
          }
          return this.instance;
        }
        calculateCharInLine(ctx, textSize, maxWidth) {
          if (!this.storeMap.has(textSize)) {
            this.storeMap.set(textSize, /* @__PURE__ */ new Map());
          }
          if (this.storeMap.get(textSize).has(maxWidth)) {
            return this.storeMap.get(textSize).get(maxWidth);
          }
          let text = "\u4F60\u597D\uFF0C\u4E16\u754C";
          ctx.save();
          ctx.font = `$textSize}px bold`;
          let drawLength = ctx.measureText(text).width;
          let textLength = text.length;
          let result = Math.floor(maxWidth / (drawLength / textLength));
          this.storeMap.get(textSize).set(maxWidth, result);
          ctx.restore();
          return result;
        }
        calculateOnCharWidth(ctx, textSize) {
          let text = "\u4F60\u597D\uFF0C\u4E16\u754C";
          ctx.save();
          ctx.font = `${textSize}px bold`;
          let drawLength = ctx.measureText(text).width;
          ctx.restore();
          return drawLength / text.length;
        }
        calculateChineseCharWidth(ctx, textSize) {
          if (this.chineseSizeMap.has(textSize)) {
            return this.chineseSizeMap.get(textSize);
          }
          let text = "\u4F60";
          ctx.save();
          ctx.font = `${textSize}px bold`;
          let drawLength = ctx.measureText(text).width;
          ctx.restore();
          this.chineseSizeMap.set(textSize, drawLength);
          return drawLength;
        }
        calculateASIICharWidth(ctx, textSize) {
          if (this.englishSizeMap.has(textSize)) {
            return this.englishSizeMap.get(textSize);
          }
          let text = "a";
          ctx.save();
          ctx.font = `${textSize}px bold`;
          let drawLength = ctx.measureText(text).width;
          ctx.restore();
          this.englishSizeMap.set(textSize, drawLength);
          return drawLength;
        }
      };
      exports.TextHelper = TextHelper;
    }
  });

  // js/widgets/textview.js
  var require_textview = __commonJS({
    "js/widgets/textview.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Text = void 0;
      var colors_1 = require_colors();
      var simple_view_1 = require_simple_view();
      var textview_state_machine_1 = require_textview_state_machine();
      var text_helper_1 = require_text_helper();
      var Text = class {
        constructor(content) {
          this.content = content;
          this.textEffects = /* @__PURE__ */ new Map();
        }
        updatePatternDrawFunc(text, fn) {
          this.textEffects.set(text, fn);
          return this;
        }
        setDefaultEffect(fn) {
          this.defaultEffect = fn;
          return this;
        }
      };
      exports.Text = Text;
      var TextView = class extends simple_view_1.default {
        constructor(text = new Text("Hello world")) {
          super();
          this.text = text;
          this.textColor = colors_1.default.white;
          this.disabledTextColor = "#cccccc";
          this.textSize = 24;
          this.drawItems = [];
          this.underline = false;
          this.showTextLength = text.content.length;
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          ctx.save();
          this.applyStyle(ctx);
          let chineseFontWidth = text_helper_1.TextHelper.getInstance().calculateChineseCharWidth(ctx, this.textSize);
          let englishFontWidth = text_helper_1.TextHelper.getInstance().calculateASIICharWidth(ctx, this.textSize);
          this.lineHeight = this.textSize;
          let textParser = new textview_state_machine_1.default();
          textParser.parse(this.text.content, this.lineHeight, maxWidthForCalculation, chineseFontWidth, englishFontWidth);
          ctx.restore();
          this.drawItems = textParser.output();
          return {
            calcWidth: textParser.maxWidth,
            calcHeight: textParser.maxHeight
          };
        }
        setText(text) {
          this.text = text;
          this.showTextLength = text.content.length;
          this.setIsDirty(true);
        }
        setTransparent() {
          this.textColor = colors_1.default.black;
        }
        applyStyle(ctx) {
          let textColor = this.textColor;
          if (!this.enable && this.disabledTextColor != void 0) {
            textColor = this.disabledTextColor;
          }
          if (textColor) {
            ctx.fillStyle = textColor;
          }
          if (this.textSize) {
            ctx.font = `${this.textSize}px bold`;
          }
        }
        onLayout(parentWidth, parentHeight, left, top) {
        }
        drawToCanvasInternal(ctx) {
          ctx.save();
          ctx.translate(this.padding.left, this.padding.bottom);
          this.applyStyle(ctx);
          for (let i = 0; i < this.drawItems.length; i++) {
            let drawItem = this.drawItems[i];
            let end = drawItem.endIndex;
            if (end <= this.showTextLength) {
              if (!drawItem.isPattern) {
                ctx.fillText(drawItem.text, drawItem.x, drawItem.y);
                if (this.underline) {
                  ctx.fillRect(drawItem.x, drawItem.y + drawItem.height, drawItem.width, 2);
                }
              } else if (this.text.textEffects.has(drawItem.text)) {
                this.text.textEffects.get(drawItem.text).draw(ctx, drawItem.x, drawItem.y, drawItem.width, drawItem.height, drawItem.text);
              } else if (this.text.defaultEffect) {
                this.text.defaultEffect.draw(ctx, drawItem.x, drawItem.y, drawItem.width, drawItem.height, drawItem.text);
              }
            } else {
              let text = drawItem.text.substr(0, this.showTextLength - drawItem.startIndex);
              if (!drawItem.isPattern) {
                ctx.fillText(text, drawItem.x, drawItem.y);
                if (this.underline) {
                  ctx.fillRect(drawItem.x, drawItem.y + drawItem.height, drawItem.width, 2);
                }
              } else if (this.text.textEffects.has(drawItem.text)) {
                this.text.textEffects.get(drawItem.text).draw(ctx, drawItem.x, drawItem.y, drawItem.width, drawItem.height, drawItem.text);
              } else if (this.text.defaultEffect) {
                this.text.defaultEffect.draw(ctx, drawItem.x, drawItem.y, drawItem.width, drawItem.height, drawItem.text);
              }
              break;
            }
          }
          ctx.restore();
        }
      };
      exports.default = TextView;
    }
  });

  // js/compose/battle_panel.js
  var require_battle_panel = __commonJS({
    "js/compose/battle_panel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BattlePanel = void 0;
      var character_1 = require_character();
      var colors_1 = require_colors();
      var text_effects_1 = require_text_effects();
      var layout_1 = require_layout();
      var imageview_1 = require_imageview();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var BattlePanel = class extends linear_layout_1.default {
        constructor() {
          super(linear_layout_1.Orientation.VERTICAL);
          this.padding.left = this.padding.right = this.padding.top = this.padding.bottom = 20;
          this.bgColor = colors_1.default.winGrey;
          let panel = new panel_1.default();
          panel.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.brief1 = new BattleBriefView();
          this.brief2 = new BattleBriefView();
          let vs = new textview_1.default(new textview_1.Text("\fvs\r").setDefaultEffect(text_effects_1.default.labelEffect));
          vs.layoutParam.xcfg = layout_1.Align.CENTER;
          vs.layoutParam.ycfg = layout_1.Align.CENTER;
          vs.debug = true;
          this.brief2.layoutParam.xcfg = layout_1.Align.END;
          panel.addView(this.brief1);
          panel.addView(vs);
          panel.addView(this.brief2);
          this.addView(panel);
          let button = new textview_1.default(new textview_1.Text("\u5F00\u59CB"));
          button.margin.top = 20;
          button.layoutParam.xcfg = layout_1.Align.END;
          button.textColor = colors_1.default.black;
          button.onclickInternal = (() => {
            this.visible = false;
            this.startBattle();
            return true;
          }).bind(this);
          this.addView(button);
          let cancelBtn = new textview_1.default(new textview_1.Text("\u53D6\u6D88"));
          cancelBtn.margin.top = 20;
          cancelBtn.layoutParam.xcfg = layout_1.Align.END;
          cancelBtn.textColor = colors_1.default.black;
          cancelBtn.onclickInternal = (() => {
            this.visible = false;
            if (this.onCancel)
              this.onCancel();
            return true;
          }).bind(this);
          this.addView(cancelBtn);
          this.visible = false;
        }
        show(ch1, ch2, onWin, onFail, onCancel) {
          this.visible = true;
          this.ch1 = ch1;
          this.ch2 = ch2;
          this.onWin = onWin;
          this.onFail = onFail;
          this.onCancel = onCancel;
          this.brief1.update(ch1);
          this.brief2.update(ch2);
          this.setIsDirty(true);
        }
        startBattle() {
          let win = this.getAttack(this.ch1) > this.getAttack(this.ch2);
          if (win && this.onWin) {
            this.onWin();
          } else if (!win && this.onFail) {
            this.onFail();
          }
        }
        getAttack(ch) {
          return ch.abilities[character_1.ABILITY.ATTACK];
        }
      };
      exports.BattlePanel = BattlePanel;
      var BattleBriefView = class extends linear_layout_1.default {
        constructor() {
          super(linear_layout_1.Orientation.VERTICAL);
          this.avatar = new imageview_1.default("");
          this.avatar.forceWidth = this.avatar.forceHeight = 100;
          this.avatar.margin.bottom = 10;
          this.attack = new textview_1.default(new textview_1.Text(""));
          this.attack.textSize = 24;
          this.attack.textColor = colors_1.default.black;
          this.addView(this.avatar);
          this.addView(this.attack);
        }
        update(ch) {
          this.avatar.img.src = ch.imageSrc;
          this.attack.setText(new textview_1.Text("\u52C7\u6B66: " + ch.abilities[character_1.ABILITY.ATTACK]));
        }
      };
    }
  });

  // js/data/goods.js
  var require_goods = __commonJS({
    "js/data/goods.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GoodsInfo = exports.Goods = void 0;
      var serializable_1 = require_serializable();
      var Goods = class extends serializable_1.BindableAndSerializable {
        constructor(info = new GoodsInfo(), count = 1) {
          super();
          this.info = info;
          this.cost = info.cost;
          this.count = count;
        }
        toParcel(p) {
          p.writeInt(this.count);
          this.info.toParcel(p);
        }
        fromParcel(p) {
          this.count = p.readInt();
          this.info.fromParcel(p);
          this.cost = this.info.cost;
        }
      };
      exports.Goods = Goods;
      var GoodsInfo = class extends serializable_1.Serializable {
        constructor() {
          super();
        }
        toParcel(p) {
          p.writeString(this.name);
          p.writeInt(this.cost);
          p.writeString(this.image);
          p.writeString(this.functional_text);
        }
        fromParcel(p) {
          this.name = p.readString();
          this.cost = p.readInt();
          this.image = p.readString();
          this.functional_text = p.readString();
        }
      };
      exports.GoodsInfo = GoodsInfo;
    }
  });

  // js/data/quest.js
  var require_quest = __commonJS({
    "js/data/quest.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var serializable_1 = require_serializable();
      var Quest = class extends serializable_1.Serializable {
        constructor() {
          super();
          this.progress = [];
          this.done = false;
        }
        toParcel(p) {
          p.writeInt(this.type);
          p.writeStringArray(this.progress);
          p.writeInt(this.done ? 1 : 0);
        }
        fromParcel(p) {
          this.type = p.readInt();
          this.progress = p.readStringArray();
          this.done = p.readInt() > 0;
        }
      };
      exports.default = Quest;
    }
  });

  // js/data/specials.js
  var require_specials = __commonJS({
    "js/data/specials.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Specials = void 0;
      var goods_affect_1 = require_goods_affect();
      var label_affect_1 = require_label_affect();
      var Specials = class {
        constructor() {
          this.simpleAndNaive = label_affect_1.LabelAffectFactory.getLabelAffect(label_affect_1.Label_Type.SimpleAndNaive);
          this.brave = label_affect_1.LabelAffectFactory.getLabelAffect(label_affect_1.Label_Type.Brave);
          this.xianting = label_affect_1.LabelAffectFactory.getLabelAffect(label_affect_1.Label_Type.Xianting);
          this.yiboyuntian = label_affect_1.LabelAffectFactory.getLabelAffect(label_affect_1.Label_Type.Yiboyuntian);
          this.kouruoxuanhe = goods_affect_1.GoodsAffectFactory.getGoodsAffect(goods_affect_1.Goods_Type.GACostDiscount, "\u53E3\u82E5\u60AC\u6CB3", "\u5546\u5E97\u8D2D\u4E70\u65F6\uFF0C\u8981\u4EF7\u4FBF\u5B9C 30%", 0.7);
          this.taizidandeenchong = goods_affect_1.GoodsAffectFactory.getGoodsAffect(goods_affect_1.Goods_Type.GACostDiscount, "\u592A\u5B50\u4E39\u7684\u6069\u5BA0", "\u71D5\u57CE\u5546\u5E97\u8D2D\u4E70\u514D\u8D39", 0);
        }
        static getInstance() {
          return this.instance;
        }
      };
      exports.Specials = Specials;
      Specials.instance = new Specials();
    }
  });

  // js/data/player.js
  var require_player = __commonJS({
    "js/data/player.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Player = exports.Event = void 0;
      var serializable_1 = require_serializable();
      var goods_affect_1 = require_goods_affect();
      var character_1 = require_character();
      var goods_1 = require_goods();
      var quest_1 = require_quest();
      var specials_1 = require_specials();
      var Event;
      (function(Event2) {
        Event2[Event2["FRE_BEGIN"] = 0] = "FRE_BEGIN";
        Event2[Event2["FRE_WHAT_LEARN"] = 1] = "FRE_WHAT_LEARN";
        Event2[Event2["FRE_WHAT_LOVE"] = 2] = "FRE_WHAT_LOVE";
        Event2[Event2["FRE_WHAT_CHARECTOR"] = 3] = "FRE_WHAT_CHARECTOR";
      })(Event = exports.Event || (exports.Event = {}));
      var Player = class extends serializable_1.BindableAndSerializable {
        constructor() {
          super();
          this.character = new character_1.Character();
          this.character.name = "\u8346\u68D8";
          this.character.imageSrc = "res/copyleft/people_gainie.png";
          this.version = 1;
          this.chooses = /* @__PURE__ */ new Map();
          this.money = 20;
          this.character.specials.push(specials_1.Specials.getInstance().kouruoxuanhe);
          this.quests = [];
          this.possessions = [];
        }
        static getInstance() {
          if (this.instance == null) {
            this.instance = new Player();
          }
          return this.instance;
        }
        saveChoose(event, choose) {
          this.chooses.set(event, choose);
        }
        getChoose(event) {
          if (!this.chooses.has(event)) {
            return Player.CHOOSE_NOT_FOUND;
          }
          return this.chooses.get(event);
        }
        toParcel(p) {
          p.writeInt(this.version);
          p.writeInt(this.money);
          this.character.toParcel(p);
          p.writeInt(this.quests.length);
          for (let i = 0; i < this.quests.length; i++) {
            this.quests[i].toParcel(p);
          }
          p.writeInt(this.possessions.length);
          for (let i = 0; i < this.possessions.length; i++) {
            this.possessions[i].toParcel(p);
          }
        }
        fromParcel(p) {
          this.version = p.readInt();
          this.money = p.readInt();
          this.character = new character_1.Character();
          this.character.fromParcel(p);
          this.quests.splice(0);
          let questSize = p.readInt();
          for (let i = 0; i < questSize; i++) {
            let quest = new quest_1.default();
            quest.fromParcel(p);
            this.quests.push(quest);
          }
          let prossessionSize = p.readInt();
          for (let i = 0; i < prossessionSize; i++) {
            let possession = new goods_1.Goods();
            possession.fromParcel(p);
            this.possessions.push(possession);
          }
        }
        applyGoodsEffect(possession) {
          let changed = false;
          this.character.specials.filter((k) => k instanceof goods_affect_1.GoodsAffect).forEach((affect) => {
            changed = affect.affect(possession) || changed;
          });
          return changed;
        }
      };
      exports.Player = Player;
      Player.instance = new Player();
      Player.CHOOSE_NOT_FOUND = -1;
    }
  });

  // js/misc/clone.js
  var require_clone = __commonJS({
    "js/misc/clone.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Clone = void 0;
      var Clone = class {
        static clone(obj) {
          let target = Object.create(obj);
          Object.assign(target, obj);
          return target;
        }
      };
      exports.Clone = Clone;
    }
  });

  // js/objects/parcel.js
  var require_parcel = __commonJS({
    "js/objects/parcel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TYPE;
      (function(TYPE2) {
        TYPE2[TYPE2["int"] = 0] = "int";
        TYPE2[TYPE2["string"] = 1] = "string";
        TYPE2[TYPE2["array"] = 2] = "array";
        TYPE2[TYPE2["parcel"] = 3] = "parcel";
        TYPE2[TYPE2["double"] = 4] = "double";
      })(TYPE || (TYPE = {}));
      var Parcel = class {
        constructor(length = 16) {
          if (length <= 0)
            length = 16;
          this.length = length;
          this._parcelData = new ArrayBuffer(this.length);
          this._dataView = new DataView(this._parcelData);
          this._readIndex = 0;
          this._writeIndex = 0;
        }
        getLength() {
          return this.length;
        }
        isEmpty() {
          return this._writeIndex == 0;
        }
        readInt() {
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.int) {
            console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let result = this._dataView.getInt32(this._readIndex);
          this._readIndex += 4;
          return result;
        }
        readDouble() {
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.double) {
            console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let result = this._dataView.getFloat64(this._readIndex);
          this._readIndex += 4;
          return result;
        }
        readString() {
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.string) {
            console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let size = this._dataView.getInt32(this._readIndex);
          this._readIndex += 4;
          let data = this._parcelData.slice(this._readIndex, this._readIndex + size * 2);
          let result = String.fromCharCode.apply(null, new Int16Array(data));
          this._readIndex += size * 2;
          return result;
        }
        readParcel() {
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.parcel) {
            console.warn(`readParcel on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let data = this.readString();
          let result = new Parcel();
          result.fromString(data);
          return result;
        }
        readArray() {
          let result = new Array();
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.array) {
            console.warn(`readArray on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let len = this._dataView.getInt32(this._readIndex);
          this._readIndex += 4;
          for (let i = 0; i < len; i++) {
            result.push(this.readParcel());
          }
          return result;
        }
        readNumberArray() {
          let array = new Array();
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.array) {
            console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let len = this._dataView.getInt32(this._readIndex);
          this._readIndex += 4;
          for (let i = 0; i < len; i++) {
            let data = this._dataView.getInt32(this._readIndex);
            this._readIndex += 4;
            array.push(data);
          }
          return array;
        }
        readStringArray() {
          let array = new Array();
          let type = this._dataView.getInt8(this._readIndex);
          if (type != TYPE.array) {
            console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
          }
          this._readIndex++;
          let len = this._dataView.getInt32(this._readIndex);
          this._readIndex += 4;
          for (let i = 0; i < len; i++) {
            let strlen = this._dataView.getInt32(this._readIndex);
            this._readIndex += 4;
            let data = this._parcelData.slice(this._readIndex, this._readIndex + strlen * 2);
            let str = String.fromCharCode.apply(null, new Int16Array(data));
            array.push(str);
            this._readIndex += strlen * 2;
          }
          return array;
        }
        writeInt(n) {
          this.enlargeIfNeeded(5);
          this._dataView.setInt8(this._writeIndex++, TYPE.int);
          this._dataView.setInt32(this._writeIndex, n);
          this._writeIndex += 4;
        }
        writeDouble(double) {
          this.enlargeIfNeeded(5);
          this._dataView.setInt8(this._writeIndex++, TYPE.double);
          this._dataView.setFloat64(this._writeIndex, double);
          this._writeIndex += 4;
        }
        writeString(str) {
          this.enlargeIfNeeded(1 + 4 + str.length * 2);
          this._dataView.setInt8(this._writeIndex++, TYPE.string);
          this._dataView.setInt32(this._writeIndex, str.length);
          this._writeIndex += 4;
          for (let i = 0; i < str.length; i++) {
            this._dataView.setInt16(this._writeIndex, str.charCodeAt(i), true);
            this._writeIndex += 2;
          }
        }
        writeParcel(parcel) {
          this.enlargeIfNeeded(1);
          this._dataView.setInt8(this._writeIndex++, TYPE.parcel);
          let str = parcel.toString();
          this.writeString(str);
        }
        writeArray(array) {
          this.enlargeIfNeeded(1 + 4);
          this._dataView.setInt8(this._writeIndex++, TYPE.array);
          this._dataView.setInt32(this._writeIndex, array.length);
          this._writeIndex += 4;
          for (let i = 0; i < array.length; i++) {
            this.writeParcel(array[i]);
          }
        }
        writeNumberArray(array) {
          this.enlargeIfNeeded(1 + 4 + array.length * 4);
          this._dataView.setInt8(this._writeIndex++, TYPE.array);
          this._dataView.setInt32(this._writeIndex, array.length);
          this._writeIndex += 4;
          for (let i = 0; i < array.length; i++) {
            this._dataView.setInt32(this._writeIndex, array[i]);
            this._writeIndex += 4;
          }
        }
        writeStringArray(array) {
          this.enlargeIfNeeded(1 + 4);
          this._dataView.setInt8(this._writeIndex++, TYPE.array);
          this._dataView.setInt32(this._writeIndex, array.length);
          this._writeIndex += 4;
          for (let i = 0; i < array.length; i++) {
            let str = array[i];
            this.enlargeIfNeeded(4 + str.length * 2);
            this._dataView.setInt32(this._writeIndex, str.length);
            this._writeIndex += 4;
            for (let i2 = 0; i2 < str.length; i2++) {
              this._dataView.setInt16(this._writeIndex, str.charCodeAt(i2), true);
              this._writeIndex += 2;
            }
          }
        }
        enlargeIfNeeded(needByte) {
          let expected = needByte + this._writeIndex;
          if (expected < this.length) {
            return;
          }
          while (this.length <= expected)
            this.length *= 2;
          let newBuffer = new ArrayBuffer(this.length);
          let fromView = new Int8Array(this._parcelData);
          let toView = new Int8Array(newBuffer);
          for (let i = 0; i < fromView.byteLength; i++) {
            toView[i] = fromView[i];
          }
          this._parcelData = newBuffer;
          this._dataView = new DataView(newBuffer);
        }
        toString() {
          return String.fromCharCode.apply(null, new Int8Array(this._parcelData));
        }
        fromString(raw) {
          let newBuffer = new ArrayBuffer(raw.length);
          let toView = new Int8Array(newBuffer);
          for (let i = 0; i < raw.length; i++) {
            toView[i] = raw.charCodeAt(i);
          }
          this.length = raw.length;
          this._writeIndex = raw.length;
          this._parcelData = newBuffer;
          this._dataView = new DataView(newBuffer);
        }
      };
      exports.default = Parcel;
    }
  });

  // js/storage/basic_info.js
  var require_basic_info = __commonJS({
    "js/storage/basic_info.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SaveInfo = void 0;
      var serializable_1 = require_serializable();
      var BasicInfo = class extends serializable_1.Serializable {
        constructor() {
          super();
          this.saveInfos = [];
          this.saveInfos.push(new SaveInfo().setData("<\u7A7A>", "slot1", ""), new SaveInfo().setData("<\u7A7A>", "slot2", ""), new SaveInfo().setData("<\u7A7A>", "slot3", ""));
        }
        toParcel(p) {
          p.writeInt(this.saveInfos.length);
          this.saveInfos.forEach((info) => {
            info.toParcel(p);
          });
        }
        fromParcel(p) {
          let infoSize = p.readInt();
          this.saveInfos.splice(0);
          for (let i = 0; i < infoSize; i++) {
            let info = new SaveInfo();
            info.fromParcel(p);
            this.saveInfos.push(info);
          }
        }
      };
      exports.default = BasicInfo;
      var SaveInfo = class extends serializable_1.Serializable {
        setData(name, dbName, date) {
          this.name = name;
          this.dbName = dbName;
          this.date = date;
          return this;
        }
        toParcel(p) {
          p.writeString(this.name);
          p.writeString(this.dbName);
          p.writeString(this.date);
        }
        fromParcel(p) {
          this.name = p.readString();
          this.dbName = p.readString();
          this.date = p.readString();
        }
      };
      exports.SaveInfo = SaveInfo;
    }
  });

  // js/storage/simple_db.js
  var require_simple_db = __commonJS({
    "js/storage/simple_db.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SimpleDb = void 0;
      var parcel_1 = require_parcel();
      var SimpleDb = class {
        constructor(dbName) {
          this.dbName = dbName;
        }
        getData(name) {
          let read = localStorage.getItem(this.keyFormat(name));
          let out = new parcel_1.default();
          if (read) {
            out.fromString(read);
          }
          return out;
        }
        saveData(name, parcel) {
          return localStorage.setItem(this.keyFormat(name), parcel.toString());
        }
        keyFormat(name) {
          return this.dbName + "-" + name;
        }
        clear(name) {
          localStorage.removeItem(this.keyFormat(name));
        }
        clearAll() {
          for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(this.dbName)) {
              localStorage.removeItem(key);
            }
          }
        }
      };
      exports.SimpleDb = SimpleDb;
    }
  });

  // js/storage/db_manager.js
  var require_db_manager = __commonJS({
    "js/storage/db_manager.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var parcel_1 = require_parcel();
      var basic_info_1 = require_basic_info();
      var simple_db_1 = require_simple_db();
      var DBManager = class {
        constructor() {
          this.use("default");
        }
        static getInstance() {
          return DBManager.manager;
        }
        use(dbName) {
          this.dbName = dbName;
          this.db = new simple_db_1.SimpleDb(dbName);
          if (this.reload_) {
            this.reload_(this.db);
          }
        }
        save() {
          if (this.save_) {
            this.save_(this.db);
          }
          this.setSaveInfo(this.dbName, this.dbName, this.getDateString());
        }
        setReloadFn(fn) {
          this.reload_ = fn;
        }
        setSaveFn(fn) {
          this.save_ = fn;
        }
        getDb() {
          return this.db;
        }
        clearAllSave(dbName) {
          new simple_db_1.SimpleDb(dbName).clearAll();
          this.setSaveInfo(dbName, "<\u7A7A>", "");
        }
        getDateString() {
          return new Date().toDateString();
        }
        getSaveInfos() {
          let basicInfo = new basic_info_1.default();
          let p = new simple_db_1.SimpleDb("basic").getData("info");
          if (!p.isEmpty()) {
            basicInfo.fromParcel(p);
          }
          return basicInfo.saveInfos;
        }
        setSaveInfo(dbName, name, date) {
          let basicDb = new simple_db_1.SimpleDb("basic");
          let basicInfo = new basic_info_1.default();
          let p = basicDb.getData("info");
          if (!p.isEmpty()) {
            basicInfo.fromParcel(p);
          }
          basicInfo.saveInfos.filter((info) => info.dbName == dbName).forEach((info) => {
            info.name = name;
            info.date = date;
          });
          let out = new parcel_1.default();
          basicInfo.toParcel(out);
          basicDb.saveData("info", out);
        }
      };
      exports.default = DBManager;
      DBManager.manager = new DBManager();
    }
  });

  // js/widgets/scrollview.js
  var require_scrollview = __commonJS({
    "js/widgets/scrollview.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ScrollView = void 0;
      var panel_1 = require_panel();
      var ScrollView = class extends panel_1.default {
        constructor() {
          super();
          this.offsetX = 0;
          this.offsetY = 0;
          this.childrenMaxWidth = 0;
          this.childrenMaxHeight = 0;
          this.dragStartTime = 0;
          this.offsetYBeforeDrag = 0;
        }
        drawToCanvasInternal(ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(this.width, 0);
          ctx.lineTo(this.width, this.height), ctx.lineTo(0, this.height);
          ctx.lineTo(0, 0);
          ctx.clip();
          ctx.translate(this.offsetX, this.offsetY);
          super.drawToCanvasInternal(ctx);
          ctx.restore();
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          let result = super.calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation);
          this.childrenMaxWidth = result.calcWidth;
          this.childrenMaxHeight = result.calcHeight;
          return result;
        }
        scrollBy(x, y) {
          this.offsetX += x;
          this.offsetY += y;
          this.alignOffset();
        }
        ondragInternal(event) {
          if (event.startTime != this.dragStartTime) {
            this.dragStartTime = event.startTime;
            this.offsetYBeforeDrag = this.offsetY;
          }
          this.offsetY = this.offsetYBeforeDrag + event.dragY;
          this.alignOffset();
          return true;
        }
        specialModifyOnEvent(event) {
          event.x -= this.offsetX;
          event.y -= this.offsetY;
        }
        alignOffset() {
          let newOffsetX = this.offsetX;
          if (this.width > this.childrenMaxWidth) {
            newOffsetX = 0;
          } else {
            if (newOffsetX < 0) {
              newOffsetX = Math.max(newOffsetX, this.width - this.childrenMaxWidth);
            } else {
              newOffsetX = 0;
            }
          }
          this.offsetX = newOffsetX;
          let newOffsetY = this.offsetY;
          if (this.height > this.childrenMaxHeight) {
            newOffsetY = 0;
          } else {
            if (newOffsetY < 0) {
              newOffsetY = Math.max(newOffsetY, this.height - this.childrenMaxHeight);
            } else {
              newOffsetY = 0;
            }
          }
          this.offsetY = newOffsetY;
        }
      };
      exports.ScrollView = ScrollView;
    }
  });

  // js/compose/goods_panel.js
  var require_goods_panel = __commonJS({
    "js/compose/goods_panel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GoodsPanelModel = void 0;
      var bindable_data_1 = require_bindable_data();
      var player_1 = require_player();
      var assertion_1 = require_assertion();
      var clone_1 = require_clone();
      var layout_1 = require_layout();
      var db_manager_1 = require_db_manager();
      var imageview_1 = require_imageview();
      var linear_layout_1 = require_linear_layout();
      var scrollview_1 = require_scrollview();
      var sprite_1 = require_sprite();
      var textview_1 = require_textview();
      var textview_2 = require_textview();
      var GoodsPanelModel = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.goodsList = new Array();
          this.currentIndex = -1;
        }
      };
      exports.GoodsPanelModel = GoodsPanelModel;
      var PurchaseModel = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.count = 1;
          this.cost = 0;
          this.maxCount = 1;
          this.minCount = 0;
        }
      };
      var DescriptionView = class extends linear_layout_1.default {
        constructor() {
          super();
          this.orientation = linear_layout_1.Orientation.VERTICAL;
          this.purchaseModel = new PurchaseModel();
          this.title = new textview_1.default();
          this.title.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.title.textColor = "#000000";
          this.title.textSize = 16;
          this.content = new textview_1.default();
          this.title.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.content.textColor = "#000000";
          this.content.textSize = 12;
          this.left = new textview_1.default();
          this.left.textColor = "#000000";
          this.left.textSize = 12;
          this.left.layoutParam.xcfg = layout_1.Align.END;
          this.left.margin.bottom = 10;
          this.addView(this.title);
          this.addView(this.content);
          this.addView(this.left);
          let numberLayer = new linear_layout_1.default();
          numberLayer.orientation = linear_layout_1.Orientation.HORIZONTAL;
          numberLayer.layoutParam.xcfg = layout_1.Align.END;
          numberLayer.margin.bottom = 10;
          let plusBtn = new imageview_1.default("res/created/plus.png");
          plusBtn.forceWidth = plusBtn.forceHeight = 20;
          this.numberLabel = new textview_1.default(new textview_2.Text("1"));
          let minusBtn = new imageview_1.default("res/created/minus.png");
          minusBtn.forceWidth = minusBtn.forceHeight = 20;
          this.numberLabel.margin.left = this.numberLabel.margin.right = 10;
          numberLayer.addView(minusBtn);
          numberLayer.addView(this.numberLabel);
          numberLayer.addView(plusBtn);
          this.addView(numberLayer);
          this.costLabel = new textview_1.default(new textview_2.Text("\u9700 X \u91D1"));
          this.costLabel.layoutParam.xcfg = layout_1.Align.END;
          this.costLabel.margin.bottom = 10;
          this.addView(this.costLabel);
          plusBtn.onclickInternal = (() => {
            if (this.purchaseModel.count < this.purchaseModel.maxCount) {
              this.purchaseModel.count++;
              this.purchaseModel.dirty = true;
            }
            return true;
          }).bind(this);
          plusBtn.onpressInternal = plusBtn.onclickInternal;
          minusBtn.onclickInternal = (() => {
            if (this.purchaseModel.count > this.purchaseModel.minCount) {
              this.purchaseModel.count--;
              this.purchaseModel.dirty = true;
            }
            return true;
          }).bind(this);
          minusBtn.onpressInternal = minusBtn.onclickInternal;
          this.yourMoneyLabel = new textview_1.default(new textview_2.Text(`\u60A8\u7684\u91D1\u94B1: ${player_1.Player.getInstance().money}`));
          this.yourMoneyLabel.layoutParam.xcfg = layout_1.Align.END;
          this.addView(this.yourMoneyLabel);
          this.purchaseBtn = new textview_1.default(new textview_2.Text("\u8D2D\u4E70"));
          this.purchaseBtn.layoutParam.xcfg = layout_1.Align.END;
          this.purchaseBtn.bgColor = "#d3d3d3";
          this.purchaseBtn.onclickInternal = (() => {
            let cost = this.purchaseModel.cost * this.purchaseModel.count;
            assertion_1.default.expectTrue(player_1.Player.getInstance().money > cost);
            player_1.Player.getInstance().money -= cost;
            this.yourMoneyLabel.setText(new textview_2.Text(`\u60A8\u7684\u91D1\u94B1: ${player_1.Player.getInstance().money}`));
            let possession = clone_1.Clone.clone(this.purchaseModel.original);
            possession.count = this.purchaseModel.count;
            player_1.Player.getInstance().possessions.push(possession);
            db_manager_1.default.getInstance().save();
            this.purchaseModel.original.count -= this.purchaseModel.count;
            this.purchaseModel.count = 1;
            this.purchaseModel.dirty = true;
            this.purchaseModel.original.dirty = true;
            return true;
          }).bind(this);
          this.addView(this.purchaseBtn);
          this.bindData(this.purchaseModel, DescriptionView.bindModel);
        }
        update(goods) {
          this.title.bindData(goods, ((v, d) => {
            this.title.setText(new textview_2.Text(d.info.name));
            this.content.setText(new textview_2.Text(d.info.functional_text));
            this.left.setText(new textview_2.Text("\u5269\u4F59: " + d.count));
          }).bind(this));
          let copy = clone_1.Clone.clone(goods);
          player_1.Player.getInstance().applyGoodsEffect(copy);
          this.purchaseModel.count = 1;
          this.purchaseModel.cost = copy.cost;
          this.purchaseModel.maxCount = copy.count;
          this.purchaseModel.original = goods;
          this.purchaseModel.dirty = true;
        }
        static bindModel(view, data) {
          view.numberLabel.setText(new textview_2.Text("" + view.purchaseModel.count));
          let currentCost = view.purchaseModel.cost * view.purchaseModel.count;
          if (!view.purchaseModel.original) {
            view.costLabel.setText(new textview_2.Text(`\u9700 ${currentCost} \u91D1`));
            return;
          }
          let originalCost = view.purchaseModel.original.cost * view.purchaseModel.count;
          if (originalCost == currentCost) {
            view.costLabel.setText(new textview_2.Text(`\u9700 ${currentCost} \u91D1`));
          } else {
            let gap = currentCost - originalCost;
            if (gap > 0) {
              view.costLabel.setText(new textview_2.Text(`\u9700 ${currentCost}(+${gap}) \u91D1`));
            } else {
              view.costLabel.setText(new textview_2.Text(`\u9700 ${currentCost}(${gap}) \u91D1`));
            }
          }
          view.yourMoneyLabel.setText(new textview_2.Text(`\u60A8\u7684\u91D1\u94B1: ${player_1.Player.getInstance().money}`));
          view.purchaseBtn.enable = player_1.Player.getInstance().money > currentCost;
        }
      };
      var GoodsPanel = class extends linear_layout_1.default {
        constructor() {
          super();
          this.orientation = linear_layout_1.Orientation.HORIZONTAL;
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.layoutParam.xcfg = this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.margin.left = this.margin.right = 40;
          this.padding.left = this.padding.right = this.padding.top = this.padding.bottom = 20;
          this.bgColor = "#e6e6e6";
          let scrollView = new scrollview_1.ScrollView();
          scrollView.layoutParam.yLayout = layout_1.LayoutType.MATCH_PARENT;
          scrollView.layoutParam.weight = 1;
          this.scrollView = scrollView;
          this.goodsList = new linear_layout_1.default(linear_layout_1.Orientation.VERTICAL);
          this.scrollView.addView(this.goodsList);
          this.addView(this.scrollView);
          this.description = new DescriptionView();
          this.description.layoutParam.weight = 1;
          this.description.margin.left = 20;
          this.addView(this.description);
        }
        onTouchOutside() {
          if (this.visible) {
            this.visible = false;
            return true;
          }
          return false;
        }
        bindModel(model) {
          this.bindData(model, GoodsPanel.update);
        }
        static update(view, model) {
          view.goodsList.removeAllViews();
          for (let i = 0; i < model.goodsList.length; i++) {
            let goods = model.goodsList[i];
            let row = new linear_layout_1.default(linear_layout_1.Orientation.HORIZONTAL);
            row.border = new sprite_1.Border();
            row.border.color = "#d3d3d3";
            row.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
            let tv = new textview_1.default(new textview_2.Text(goods.info.name));
            tv.textColor = "#000000";
            tv.textSize = 16;
            tv.layoutParam.ycfg = layout_1.Align.CENTER;
            tv.layoutParam.weight = 1;
            row.addView(tv);
            let img = new imageview_1.default(goods.info.image);
            img.forceWidth = img.forceHeight = 30;
            img.margin.left = 20;
            row.addView(img);
            row.onclickInternal = () => {
              model.currentIndex = i;
              model.dirty = true;
              return true;
            };
            view.goodsList.addView(row);
          }
          if (model.currentIndex < 0) {
            view.description.visible = false;
          } else {
            view.description.update(model.goodsList[model.currentIndex]);
            view.description.visible = true;
          }
          view.description.setIsDirty(true);
          view.goodsList.setIsDirty(true);
          view.scrollView.setIsDirty(true);
          view.setIsDirty(true);
        }
      };
      exports.default = GoodsPanel;
    }
  });

  // js/game/data/styles/text_sizes.js
  var require_text_sizes = __commonJS({
    "js/game/data/styles/text_sizes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TextSizes = class {
      };
      exports.default = TextSizes;
      TextSizes.normal = 16;
      TextSizes.small = 12;
      TextSizes.big = 20;
    }
  });

  // js/compose/message_box.js
  var require_message_box = __commonJS({
    "js/compose/message_box.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var colors_1 = require_colors();
      var text_sizes_1 = require_text_sizes();
      var layout_1 = require_layout();
      var linear_layout_1 = require_linear_layout();
      var textview_1 = require_textview();
      var MessageBox = class extends linear_layout_1.default {
        constructor() {
          super();
          this.layoutParam.xcfg = this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.margin.left = this.margin.right = 20;
          this.padding.left = this.padding.right = this.padding.bottom = this.padding.top = 20;
          this.titleView = new textview_1.default();
          this.contentView = new textview_1.default();
          this.titleView.layoutParam.xcfg = layout_1.Align.CENTER;
          this.contentView.layoutParam.xcfg = layout_1.Align.CENTER;
          this.contentView.margin.top = 20;
          this.addView(this.titleView);
          this.addView(this.contentView);
          this.bgColor = colors_1.default.winGrey;
          this.titleView.textColor = colors_1.default.black;
          this.contentView.textColor = colors_1.default.black;
          this.titleView.textSize = text_sizes_1.default.normal;
          this.contentView.textSize = text_sizes_1.default.small;
        }
        show(title, content) {
          this.visible = true;
          this.titleView.setText(title);
          this.contentView.setText(content);
          this.setIsDirty(true);
        }
        onTouchOutside() {
          if (this.visible) {
            this.visible = false;
            if (this.onMessageBoxDismiss) {
              let callback = this.onMessageBoxDismiss;
              this.onMessageBoxDismiss = null;
              callback();
            }
            return true;
          }
          return false;
        }
      };
      exports.default = MessageBox;
    }
  });

  // js/compose/player_description_view.js
  var require_player_description_view = __commonJS({
    "js/compose/player_description_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var character_1 = require_character();
      var layout_1 = require_layout();
      var imageview_1 = require_imageview();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var richtext_1 = require_richtext();
      var textview_1 = require_textview();
      var PlayerDescriptionView = class extends panel_1.default {
        constructor() {
          super();
          this.padding.top = 20;
          this.padding.bottom = 20;
          this.padding.left = 20;
          this.padding.right = 20;
          let mainFrame = new linear_layout_1.default();
          this.addView(mainFrame);
          this.name = new textview_1.default();
          this.name.margin.bottom = 10;
          this.name.textSize = 28;
          this.name.textColor = "black";
          mainFrame.addView(this.name);
          let attributeLayer = new linear_layout_1.default();
          let label = new textview_1.default(new textview_1.Text("\u5C5E\u6027"));
          label.textColor = "black";
          attributeLayer.addView(label);
          this.loyal = new textview_1.default();
          this.attack = new textview_1.default();
          this.inteligence = new textview_1.default();
          this.trust = new textview_1.default();
          this.loyal.textSize = 12;
          this.attack.textSize = 12;
          this.inteligence.textSize = 12;
          this.trust.textSize = 12;
          this.loyal.textColor = "black";
          this.attack.textColor = "black";
          this.inteligence.textColor = "black";
          this.trust.textColor = "black";
          attributeLayer.addView(this.loyal);
          attributeLayer.addView(this.attack);
          attributeLayer.addView(this.inteligence);
          attributeLayer.addView(this.trust);
          mainFrame.addView(attributeLayer);
          attributeLayer.margin.bottom = 20;
          let specialLabel = new textview_1.default(new textview_1.Text("\u7279\u6280"));
          specialLabel.textColor = "black";
          mainFrame.addView(specialLabel);
          specialLabel.margin.bottom = 10;
          this.special = new textview_1.default();
          this.special.textSize = 12;
          this.special.textColor = "black";
          mainFrame.addView(this.special);
          this.image = new imageview_1.default("");
          this.image.forceWidth = 120;
          this.image.forceHeight = 120;
          this.image.layoutParam.xcfg = layout_1.Align.END;
          this.addView(this.image);
          this.bgColor = "#FFF99D";
        }
        setCharacter(character) {
          this.onPlayerUpdate(character);
        }
        onTouchOutside(event) {
          if (this.visible) {
            this.visible = false;
            return true;
          }
          return false;
        }
        onPlayerUpdate(character) {
          this.name.setText(new textview_1.Text(character.name));
          this.image.img.src = character.imageSrc;
          this.loyal.setText(new textview_1.Text("\u4FA0\u4E49: " + character.abilities[character_1.ABILITY.LOYAL]));
          this.attack.setText(new textview_1.Text("\u52C7\u6B66: " + character.abilities[character_1.ABILITY.ATTACK]));
          this.inteligence.setText(new textview_1.Text("\u8C0B\u7565: " + character.abilities[character_1.ABILITY.INTELIGENCE]));
          this.trust.setText(new textview_1.Text("\u4FE1\u8A89: " + character.abilities[character_1.ABILITY.TRUST]));
          let descriptionText = "";
          character.specials.forEach((special) => {
            descriptionText += `\f${special.name}\r ${special.description}
`;
          });
          let description = new textview_1.Text(descriptionText);
          description.setDefaultEffect(new richtext_1.BgText("white", "black"));
          this.special.setText(description);
        }
      };
      exports.default = PlayerDescriptionView;
    }
  });

  // js/compose/page_list.js
  var require_page_list = __commonJS({
    "js/compose/page_list.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PageList = exports.PageListInfo = exports.PageInfo = void 0;
      var bindable_data_1 = require_bindable_data();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var PageInfo = class {
      };
      exports.PageInfo = PageInfo;
      var PageListInfo = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.currentIndex = -1;
          this.pages = new Array();
        }
      };
      exports.PageListInfo = PageListInfo;
      var PageList = class extends linear_layout_1.default {
        constructor() {
          super();
          this.padding.left = this.padding.right = this.padding.top = this.padding.bottom = 20;
          this.titlePanel = new linear_layout_1.default();
          this.titlePanel.orientation = linear_layout_1.Orientation.HORIZONTAL;
          this.titlePanel.margin.bottom = 20;
          this.contentPanel = new panel_1.default();
          this.contentPanel.layoutParam.weight = 1;
          this.addView(this.titlePanel);
          this.addView(this.contentPanel);
          this.listInfo = new PageListInfo();
          this.listInfo.textSelectedColor = "#000000";
          this.listInfo.textUnselectedColor = "#5c5c5c";
          this.bindData(this.listInfo, PageList.onListInfoChange.bind(this));
          this.bgColor = "#f0f0f0";
        }
        addPage(title, page) {
          let info = new PageInfo();
          info.title = title;
          info.page = page;
          this.listInfo.pages.push(info);
          this.listInfo.dirty = true;
        }
        static onListInfoChange(pageList, listInfo) {
          if (listInfo.currentIndex < 0) {
            listInfo.currentIndex = 0;
          }
          if (listInfo.pages.length <= 0) {
            return;
          }
          if (listInfo.currentIndex > listInfo.pages.length) {
            listInfo.currentIndex = listInfo.pages.length - 1;
          }
          pageList.titlePanel.removeAllViews();
          for (let i = 0; i < listInfo.pages.length; i++) {
            let info = listInfo.pages[i];
            let title = new textview_1.default(new textview_1.Text(info.title));
            title.margin.right = 10;
            title.onclickInternal = (ignore) => {
              listInfo.currentIndex = i;
              listInfo.dirty = true;
              return true;
            };
            if (i == listInfo.currentIndex) {
              title.underline = true;
              title.textColor = listInfo.textSelectedColor;
            } else {
              title.textColor = listInfo.textUnselectedColor;
            }
            pageList.titlePanel.addView(title);
          }
          pageList.titlePanel.setIsDirty(true);
          let currentPage = pageList.listInfo.pages[listInfo.currentIndex].page;
          pageList.contentPanel.removeAllViews();
          pageList.contentPanel.addView(currentPage);
          pageList.contentPanel.setIsDirty(true);
          pageList.setIsDirty(true);
        }
      };
      exports.PageList = PageList;
    }
  });

  // js/data/quest_data.js
  var require_quest_data = __commonJS({
    "js/data/quest_data.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.QuestType = void 0;
      var QuestType;
      (function(QuestType2) {
        QuestType2[QuestType2["YourConfuzed"] = 0] = "YourConfuzed";
        QuestType2[QuestType2["JingkeConfuzed"] = 1] = "JingkeConfuzed";
        QuestType2[QuestType2["BuyWineForJingke"] = 2] = "BuyWineForJingke";
      })(QuestType = exports.QuestType || (exports.QuestType = {}));
      var QuestData = class {
        static getData(type) {
          switch (type) {
            case QuestType.YourConfuzed:
              return {
                name: "\u8346\u68D8\u7684\u56F0\u60D1",
                desc: "\u672A\u6765\u5E94\u8BE5\u600E\u4E48\u8D70\uFF0C\u73B0\u5728\u4F60\u6CA1\u6CD5\u56DE\u7B54\uFF0C\u4F60\u53EA\u80FD\u5F80\u4E0B\u8D70\uFF0C\u591A\u770B\u770B\uFF0C\u5BFB\u627E\u7075\u611F"
              };
            case QuestType.JingkeConfuzed:
              return {
                name: "\u8346\u8F72\u7684\u56F0\u60D1",
                desc: "\u4F60\u7684\u53D4\u53D4\u4F3C\u4E4E\u6709\u4EC0\u4E48\u4E8B\u60C5\u7792\u7740\uFF0C\u4F60\u60F3\u8C03\u67E5\u6E05\u695A\uFF0C\u5E2E\u4ED6\u89E3\u51B3"
              };
            case QuestType.BuyWineForJingke:
              return {
                name: "\u4E70\u71D5\u6D4A\u9152",
                desc: "\u8205\u8205\u7684\u9152\u6CA1\u4E86 \u6211\u5F97\u7ED9\u4ED6\u4E70 \u71D5\u6D4A\u9152"
              };
          }
        }
      };
      exports.default = QuestData;
    }
  });

  // js/widgets/compose/scrollview_with_button.js
  var require_scrollview_with_button = __commonJS({
    "js/widgets/compose/scrollview_with_button.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var layout_1 = require_layout();
      var imageview_1 = require_imageview();
      var panel_1 = require_panel();
      var scrollview_1 = require_scrollview();
      var ScrollViewWithButton = class extends panel_1.default {
        constructor(align = layout_1.Align.END) {
          super();
          let scrollView = new scrollview_1.ScrollView();
          scrollView.layoutParam.xcfg = align;
          if (align == layout_1.Align.START) {
            scrollView.margin.left = 20;
          } else {
            scrollView.margin.right = 20;
          }
          scrollView.layoutParam.yLayout = layout_1.LayoutType.MATCH_PARENT;
          this.addView(scrollView);
          this.scrollView = scrollView;
          let upBtn = new imageview_1.default("res/created/up.png");
          let downBtn = new imageview_1.default("res/created/down.png");
          upBtn.forceWidth = upBtn.forceHeight = 20;
          upBtn.layoutParam.xcfg = align;
          upBtn.layoutParam.ycfg = layout_1.Align.CENTER;
          upBtn.margin.top = -20;
          downBtn.forceWidth = downBtn.forceHeight = 20;
          downBtn.layoutParam.xcfg = align;
          downBtn.layoutParam.ycfg = layout_1.Align.CENTER;
          downBtn.margin.top = 20;
          upBtn.onclickInternal = upBtn.onpressInternal = (event) => {
            scrollView.scrollBy(0, -10);
            return true;
          };
          downBtn.onclickInternal = downBtn.onpressInternal = (event) => {
            scrollView.scrollBy(0, 10);
            return true;
          };
          this.goodsUpBtn = upBtn;
          this.goodsDownBtn = downBtn;
          this.addView(upBtn);
          this.addView(downBtn);
        }
        setContentView(content) {
          this.scrollView.removeAllViews();
          this.scrollView.addView(content);
        }
        setIsDirty(dirty) {
          super.setIsDirty(dirty);
          this.scrollView.setIsDirty(dirty);
        }
      };
      exports.default = ScrollViewWithButton;
    }
  });

  // js/compose/quest_panel.js
  var require_quest_panel = __commonJS({
    "js/compose/quest_panel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProgressBoard = exports.QuestPanel = void 0;
      var quest_data_1 = require_quest_data();
      var colors_1 = require_colors();
      var scrollview_with_button_1 = require_scrollview_with_button();
      var linear_layout_1 = require_linear_layout();
      var textview_1 = require_textview();
      var QuestPanel = class extends linear_layout_1.default {
        constructor() {
          super(linear_layout_1.Orientation.HORIZONTAL);
          this.scrollViewWithButton = new scrollview_with_button_1.default();
          this.scrollViewWithButton.layoutParam.weight = 1;
          this.addView(this.scrollViewWithButton);
          this.questList = new linear_layout_1.default(linear_layout_1.Orientation.VERTICAL);
          this.scrollViewWithButton.setContentView(this.questList);
          this.progressBoard = new ProgressBoard();
          this.progressBoard.layoutParam.weight = 1;
          this.addView(this.progressBoard);
        }
        setIsDirty(dirty) {
          super.setIsDirty(dirty);
          this.scrollViewWithButton.setIsDirty(dirty);
          this.progressBoard.setIsDirty(dirty);
          this.questList.setIsDirty(dirty);
        }
        update(quests) {
          this.questList.removeAllViews();
          let that = this;
          quests.forEach((quest) => {
            let { name, desc } = quest_data_1.default.getData(quest.type);
            let tv = new textview_1.default(new textview_1.Text(name));
            tv.textColor = colors_1.default.black;
            tv.onclickInternal = () => {
              that.progressBoard.update(desc, quest.progress);
              return true;
            };
            that.questList.addView(tv);
          });
          this.setIsDirty(true);
        }
      };
      exports.QuestPanel = QuestPanel;
      var ProgressBoard = class extends linear_layout_1.default {
        constructor() {
          super(linear_layout_1.Orientation.VERTICAL);
          this.desc = new textview_1.default(new textview_1.Text(""));
          this.addView(this.desc);
          this.progress = new linear_layout_1.default();
          this.addView(this.progress);
        }
        update(desc, progress) {
          this.desc.setText(new textview_1.Text(desc));
          this.progress.removeAllViews();
          progress.forEach((item) => {
            let tv = new textview_1.default(new textview_1.Text(item));
            this.progress.addView(tv);
          });
          this.setIsDirty(true);
        }
      };
      exports.ProgressBoard = ProgressBoard;
    }
  });

  // js/compose/user_goods_view.js
  var require_user_goods_view = __commonJS({
    "js/compose/user_goods_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UserGoodsView = void 0;
      var bindable_data_1 = require_bindable_data();
      var colors_1 = require_colors();
      var layout_1 = require_layout();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var scrollview_1 = require_scrollview();
      var sprite_1 = require_sprite();
      var textview_1 = require_textview();
      var GoodsModel = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.items = new Array();
          this.selectIndex = -1;
        }
      };
      var UserGoodsView = class extends panel_1.default {
        constructor() {
          super();
          this.model = new GoodsModel();
          this.prossessionListView = new linear_layout_1.default();
          this.prossessionListView.forceWidth = 200;
          this.prossessionListView.orientation = linear_layout_1.Orientation.VERTICAL;
          this.scrollView = new scrollview_1.ScrollView();
          this.scrollView.layoutParam.xcfg = layout_1.Align.END;
          this.scrollView.layoutParam.yLayout = layout_1.LayoutType.MATCH_PARENT;
          this.scrollView.addView(this.prossessionListView);
          this.addView(this.scrollView);
          this.descriptionView = new textview_1.default();
          this.descriptionView.margin.right = this.prossessionListView.forceWidth + 20;
          this.descriptionView.textColor = "black";
          this.descriptionView.textSize = 12;
          this.addView(this.descriptionView);
          this.moneyView = new textview_1.default();
          this.moneyView.margin.right = this.descriptionView.margin.right;
          this.moneyView.layoutParam.ycfg = layout_1.Align.END;
          this.moneyView.textColor = colors_1.default.black;
          this.moneyView.textSize = 12;
          this.addView(this.moneyView);
          this.bindData(this.model, UserGoodsView.updateGoodsListView);
        }
        static updateGoodsListView(view, model) {
          view.prossessionListView.removeAllViews();
          for (let i = 0; i < model.items.length; i++) {
            let goods = model.items[i];
            let tv = new textview_1.default(new textview_1.Text(goods.info.name));
            tv.border = new sprite_1.Border();
            tv.border.color = "black";
            tv.textColor = "black";
            tv.textSize = 12;
            tv.layoutParam.xcfg = layout_1.Align.END;
            tv.onclickInternal = (event) => {
              model.selectIndex = i;
              model.dirty = true;
              return true;
            };
            view.prossessionListView.addView(tv);
          }
          if (model.selectIndex < 0 || model.selectIndex >= model.items.length) {
            view.descriptionView.setText(new textview_1.Text(""));
          } else {
            let item = model.items[model.selectIndex];
            view.descriptionView.setText(new textview_1.Text("\u540D\u5B57: " + item.info.name + "\n\u6570\u76EE: " + item.count + "\n\u529F\u6548: " + item.info.functional_text));
          }
          view.moneyView.setText(new textview_1.Text(`\u5269\u4F59\u91D1\u94B1 ${model.money}`));
          view.prossessionListView.setIsDirty(true);
          view.scrollView.setIsDirty(true);
          view.descriptionView.setIsDirty(true);
          view.setIsDirty(true);
        }
      };
      exports.UserGoodsView = UserGoodsView;
    }
  });

  // js/compose/UserPanel.js
  var require_UserPanel = __commonJS({
    "js/compose/UserPanel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var player_1 = require_player();
      var layout_1 = require_layout();
      var page_list_1 = require_page_list();
      var player_description_view_1 = require_player_description_view();
      var quest_panel_1 = require_quest_panel();
      var user_goods_view_1 = require_user_goods_view();
      var UserPanel = class extends page_list_1.PageList {
        constructor() {
          super();
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.layoutParam.xcfg = this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.margin.left = this.margin.right = 40;
          this.descriptionView = new player_description_view_1.default();
          this.descriptionView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.descriptionView.layoutParam.xcfg = layout_1.Align.CENTER;
          this.descriptionView.layoutParam.ycfg = layout_1.Align.CENTER;
          this.addPage("\u72B6\u6001", this.descriptionView);
          this.prossessionPage = new user_goods_view_1.UserGoodsView();
          this.prossessionPage.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.addPage("\u7269\u54C1", this.prossessionPage);
          this.questPanel = new quest_panel_1.QuestPanel();
          this.addPage("\u4EFB\u52A1", this.questPanel);
          this.descriptionView.bgColor = void 0;
          this.bgColor = "#e6e6e6";
        }
        updateCharacter(character) {
          this.descriptionView.setCharacter(character);
          this.prossessionPage.model.items = player_1.Player.instance.possessions;
          this.prossessionPage.model.money = player_1.Player.instance.money;
          this.prossessionPage.model.dirty = true;
          this.questPanel.update(player_1.Player.instance.quests);
        }
        onTouchOutside() {
          if (!this.visible) {
            return false;
          }
          this.visible = false;
          return true;
        }
      };
      exports.default = UserPanel;
    }
  });

  // js/widgets/dialogue_view.js
  var require_dialogue_view = __commonJS({
    "js/widgets/dialogue_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var number_linear_animator_1 = require_number_linear_animator();
      var layout_1 = require_layout();
      var imageview_1 = require_imageview();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var sprite_1 = require_sprite();
      var textview_1 = require_textview();
      var DialogueView = class extends panel_1.default {
        constructor() {
          super();
          this.layoutParam = new layout_1.LayoutParams(layout_1.Align.START, layout_1.Align.END);
          this.visible = false;
          this.border = new sprite_1.Border();
          this.debugColor = "green";
          this.padding.left = 20;
          this.padding.top = 10;
          this.padding.right = 20;
          this.padding.bottom = 20;
          this.nameViewLeft = new textview_1.default(new textview_1.Text("\u90D1\u5927\u4FA0"));
          this.nameViewRight = new textview_1.default(new textview_1.Text("\u5609\u5973\u58EB"));
          this.contentView = new textview_1.default(new textview_1.Text("\u4F60\u597D\uFF0C\u5192\u9669\u8005"));
          this.nameViewLeft.textColor = "black";
          this.nameViewRight.textColor = "black";
          this.contentView.textColor = "black";
          this.addView(this.nameViewLeft);
          this.addView(this.nameViewRight);
          this.addView(this.contentView);
          this.nameViewRight.layoutParam = new layout_1.LayoutParams(layout_1.Align.END, layout_1.Align.START);
          this.nameViewRight.visible = false;
          this.contentView.margin.top = 40;
          this.contentView.margin.bottom = 20;
          this.contentView.textSize = 16;
          this.avatarLayer = new AvatarLayer();
          this.avatarLayer.margin.top = -100 - this.padding.top;
          this.avatarLayer.margin.left = -this.padding.left;
          this.avatarLayer.margin.right = -this.padding.right;
          this.addView(this.avatarLayer);
          this.animators = new Array();
          this.queue = new Array();
        }
        addDialogue(data) {
          this.queue.push(data);
          if (this.animators.length == 0 || this.animators.findIndex((animator) => {
            return animator.isStop();
          }) != -1) {
            let top = this.queue.shift();
            this.updateView(top);
          }
        }
        updateView(data) {
          this.visible = true;
          let nameView = data.showAtLeft ? this.nameViewLeft : this.nameViewRight;
          nameView.setText(new textview_1.Text(data.character.name));
          nameView.visible = true;
          let otherView = data.showAtLeft ? this.nameViewRight : this.nameViewLeft;
          otherView.visible = false;
          this.animators.splice(0);
          let supposedTime = data.content.content.length * 1e3 / data.speed;
          let contentAnimator = new number_linear_animator_1.default(0, data.content.content.length, supposedTime);
          this.contentView.setText(data.content);
          this.contentView.showTextLength = 0;
          this.avatarLayer.updateAvatar(data.character, data.showAtLeft);
          this.contentView.setIsDirty(true);
          nameView.setIsDirty(true);
          otherView.setIsDirty(true);
          contentAnimator.onValChange = ((val) => {
            this.contentView.showTextLength = Math.floor(val);
          }).bind(this);
          contentAnimator.onStop = (() => {
            this.onContentLoadCompleted();
          }).bind(this);
          this.animators.push(contentAnimator);
        }
        updateTime(dt) {
          this.animators.forEach((animator) => {
            animator.update(dt);
          });
        }
        onContentLoadCompleted() {
        }
        onclickInternal(event) {
          this.performNext();
          return true;
        }
        onTouchOutside() {
          if (this.visible) {
            this.performNext();
            return true;
          }
          return false;
        }
        performNext() {
          if (this.animators.length > 0 && this.animators.findIndex((animator) => {
            return !animator.isStop();
          }) != -1) {
            this.animators.forEach((animator) => {
              animator.update(animator.totalTime);
            });
          } else {
            if (this.queue.length > 0) {
              let front = this.queue.shift();
              this.updateView(front);
            } else {
              if (this.onDialogueFinished) {
                let callback = this.onDialogueFinished;
                this.onDialogueFinished = void 0;
                callback();
              }
            }
          }
        }
        onDialogueFinished() {
        }
        hide() {
          this.avatarLayer.reset();
          this.visible = false;
        }
      };
      exports.default = DialogueView;
      var AvatarLayer = class extends linear_layout_1.default {
        constructor() {
          super(linear_layout_1.Orientation.HORIZONTAL);
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.avatarsLeft = new imageview_1.default("res/copyleft/people_juzi.png");
          this.avatarsRight = new imageview_1.default("res/copyleft/people_fanwuji.png");
          this.avatarsLeft.forceWidth = this.avatarsLeft.forceHeight = this.avatarsRight.forceWidth = this.avatarsRight.forceHeight = 100;
          this.emptyPlaceHolder = new panel_1.default();
          this.emptyPlaceHolder.layoutParam.weight = 1;
          this.addView(this.avatarsLeft);
          this.addView(this.emptyPlaceHolder);
          this.addView(this.avatarsRight);
          this.avatarsLeft.visible = false;
          this.avatarsRight.visible = false;
        }
        updateAvatar(character, showAtLeft) {
          let avatar = showAtLeft ? this.avatarsLeft : this.avatarsRight;
          let opposite = showAtLeft ? this.avatarsRight : this.avatarsLeft;
          avatar.img.src = character.imageSrc;
          avatar.visible = true;
          opposite.visible = false;
        }
        reset() {
          this.avatarsLeft.visible = false;
          this.avatarsRight.visible = false;
        }
      };
    }
  });

  // js/data/option.js
  var require_option = __commonJS({
    "js/data/option.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.OPTION4 = exports.OPTION3 = exports.OPTION2 = exports.YES_NO = exports.UNKNOWN = void 0;
      exports.UNKNOWN = -1;
      var YES_NO;
      (function(YES_NO2) {
        YES_NO2[YES_NO2["UNKNOWN"] = -1] = "UNKNOWN";
        YES_NO2[YES_NO2["YES"] = 0] = "YES";
        YES_NO2[YES_NO2["NO"] = 1] = "NO";
      })(YES_NO = exports.YES_NO || (exports.YES_NO = {}));
      var OPTION2;
      (function(OPTION22) {
        OPTION22[OPTION22["UNKNOWN"] = -1] = "UNKNOWN";
        OPTION22[OPTION22["OP1"] = 0] = "OP1";
        OPTION22[OPTION22["OP2"] = 1] = "OP2";
      })(OPTION2 = exports.OPTION2 || (exports.OPTION2 = {}));
      var OPTION3;
      (function(OPTION32) {
        OPTION32[OPTION32["UNKNOWN"] = -1] = "UNKNOWN";
        OPTION32[OPTION32["OP1"] = 0] = "OP1";
        OPTION32[OPTION32["OP2"] = 1] = "OP2";
        OPTION32[OPTION32["OP3"] = 2] = "OP3";
      })(OPTION3 = exports.OPTION3 || (exports.OPTION3 = {}));
      var OPTION4;
      (function(OPTION42) {
        OPTION42[OPTION42["UNKNOWN"] = -1] = "UNKNOWN";
        OPTION42[OPTION42["OP1"] = 0] = "OP1";
        OPTION42[OPTION42["OP2"] = 1] = "OP2";
        OPTION42[OPTION42["OP3"] = 2] = "OP3";
        OPTION42[OPTION42["OP4"] = 3] = "OP4";
      })(OPTION4 = exports.OPTION4 || (exports.OPTION4 = {}));
    }
  });

  // js/widgets/option_view.js
  var require_option_view = __commonJS({
    "js/widgets/option_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Option = void 0;
      var number_linear_animator_1 = require_number_linear_animator();
      var option_1 = require_option();
      var layout_1 = require_layout();
      var linear_layout_1 = require_linear_layout();
      var sprite_1 = require_sprite();
      var textview_1 = require_textview();
      var Option = class {
        constructor(id, text) {
          this.id = id;
          this.text = text;
        }
      };
      exports.Option = Option;
      var OptionView = class extends linear_layout_1.default {
        constructor(canvas2) {
          super();
          this.border = new sprite_1.Border();
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.layoutParam.xcfg = layout_1.Align.START;
          this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.margin.left = 40;
          this.margin.right = 40;
          this.padding.top = 20;
          this.padding.bottom = 20;
          this.padding.left = 20;
          this.padding.right = 20;
          this.titleView = new textview_1.default();
          this.titleView.textColor = "black";
          this.titleView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.timingView = new textview_1.default();
          this.timingView.textColor = "#0078d7";
          this.timingView.visible = false;
          this.timingView.layoutParam.xcfg = layout_1.Align.END;
          this.bgColor = "#f0f0f0";
          this.visible = false;
        }
        show(title, options, callback, timingInSeconds = -1) {
          this.removeAllViews();
          this.titleView.setText(title);
          this.addView(this.titleView);
          options.forEach((opt) => {
            let view = this.buildOption(opt, callback);
            view.margin.top = 10;
            this.addView(view);
          });
          if (timingInSeconds > 0) {
            this.timer = new number_linear_animator_1.default(timingInSeconds, 0, timingInSeconds * 1e3);
            this.timer.onValChange = ((val) => {
              this.timingView.setText(new textview_1.Text(`${Math.floor(val)}`));
            }).bind(this);
            this.timer.onStop = () => {
              this.hide();
              callback.onOptionClicked(option_1.UNKNOWN);
            };
            this.timingView.visible = true;
            this.addView(this.timingView);
          } else {
            this.timer = void 0;
            this.timingView.visible = false;
          }
          this.setIsDirty(true);
          this.visible = true;
        }
        hide() {
          this.visible = false;
        }
        update(dt) {
          if (this.timer) {
            this.timer.update(dt);
          }
        }
        isShowing() {
          return this.visible;
        }
        onclick(event) {
          if (!this.visible)
            return false;
          super.onclick(event);
          return true;
        }
        buildOption(option, callback) {
          let textView = new textview_1.default(option.text);
          textView.textSize = 16;
          textView.onclickInternal = ((event) => {
            this.hide();
            return callback.onOptionClicked(option.id);
          }).bind(this);
          textView.padding.left = textView.padding.right = textView.padding.top = textView.padding.bottom = 5;
          textView.textColor = "black";
          textView.bgColor = "#e1e1e1";
          textView.border = new sprite_1.Border();
          textView.border.color = "#adadad";
          return textView;
        }
      };
      exports.default = OptionView;
    }
  });

  // js/scene/simple_scene.js
  var require_simple_scene = __commonJS({
    "js/scene/simple_scene.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var battle_panel_1 = require_battle_panel();
      var goods_panel_1 = require_goods_panel();
      var message_box_1 = require_message_box();
      var player_description_view_1 = require_player_description_view();
      var UserPanel_1 = require_UserPanel();
      var player_1 = require_player();
      var layout_1 = require_layout();
      var dialogue_view_1 = require_dialogue_view();
      var option_view_1 = require_option_view();
      var panel_1 = require_panel();
      var SimpleScene = class {
        constructor(canvas2) {
          this.canvasWidth = canvas2.width;
          this.canvasHeight = canvas2.height;
          this.mainPanel = new panel_1.default();
          this.optionView = new option_view_1.default(canvas2);
          this.mainPanel.forceWidth = canvas2.width;
          this.mainPanel.forceHeight = canvas2.height;
          this.mainPanel.padding.left = 20;
          this.mainPanel.padding.right = 20;
          this.mainPanel.padding.bottom = 20;
          this.animators = new Array();
          this.dialogueView = new dialogue_view_1.default();
          this.dialogueView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.dialogueView.forceHeight = canvas2.height / 4;
          this.dialogueView.margin.left = 20;
          this.dialogueView.margin.right = 20;
          this.dialogueView.margin.bottom = 20;
          this.dialogueView.layoutParam.xcfg = layout_1.Align.CENTER;
          this.dialogueView.layoutParam.ycfg = layout_1.Align.END;
          this.dialogueView.bgColor = "#FFF99D";
          this.descriptionView = new player_description_view_1.default();
          this.descriptionView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.descriptionView.layoutParam.xcfg = layout_1.Align.CENTER;
          this.descriptionView.layoutParam.ycfg = layout_1.Align.CENTER;
          this.descriptionView.margin.left = 40;
          this.descriptionView.margin.right = 40;
          this.descriptionView.visible = false;
          this.userPanel = new UserPanel_1.default();
          this.userPanel.forceHeight = canvas2.height / 3;
          this.userPanel.visible = false;
          this.goodsPanel = new goods_panel_1.default();
          this.goodsPanel.forceHeight = canvas2.height / 3;
          this.goodsPanel.visible = false;
          this.battlePanel = new battle_panel_1.BattlePanel();
          this.battlePanel.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.battlePanel.layoutParam.xcfg = layout_1.Align.CENTER;
          this.battlePanel.layoutParam.ycfg = layout_1.Align.CENTER;
          this.battlePanel.margin.left = this.battlePanel.margin.right = 20;
          this.battlePanel.visible = false;
          this.messageBox = new message_box_1.default();
          this.messageBox.visible = false;
          this.components = [
            this.mainPanel,
            this.dialogueView,
            this.descriptionView,
            this.userPanel,
            this.goodsPanel,
            this.battlePanel,
            this.optionView,
            this.messageBox
          ];
        }
        onStart(ctx) {
          this.components.forEach((component) => {
            component.measure(ctx, this.canvasWidth, this.canvasHeight, layout_1.Specify.NONE);
            component.layout(this.canvasWidth, this.canvasHeight);
          });
        }
        update(dt) {
          this.animators.forEach((animator) => {
            animator.update(dt);
          });
          this.optionView.update(dt);
          this.dialogueView.updateTime(dt);
        }
        render(ctx) {
          this.components.forEach((component) => {
            component.drawToCanvas(ctx);
          });
        }
        onclick(event) {
          for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].onclick(event)) {
              return;
            }
          }
        }
        onpress(event) {
          for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].onpress(event)) {
              return;
            }
          }
        }
        ondrag(event) {
          for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].ondrag(event)) {
              return;
            }
          }
        }
        addDialogue(data) {
          this.dialogueView.addDialogue(data);
        }
        hideDialogue() {
          this.dialogueView.hide();
        }
        showOptionView(title, options, callback, timing) {
          if (timing == void 0) {
            this.optionView.show(title, options, callback);
          } else {
            this.optionView.show(title, options, callback, timing);
          }
        }
        addAnimator(animator) {
          this.animators.push(animator);
        }
        addView(view) {
          this.mainPanel.addView(view);
        }
        forceRepaint() {
          this.mainPanel.setIsDirty(true);
        }
        setOnDialogueFinish(fn) {
          this.dialogueView.onDialogueFinished = fn;
        }
        showCharacterDescription(player) {
          this.descriptionView.setCharacter(player);
          this.descriptionView.visible = true;
        }
        showUserPanel() {
          this.userPanel.updateCharacter(player_1.Player.getInstance().character);
          this.userPanel.visible = true;
        }
        showGoodsPanel(model) {
          this.goodsPanel.bindModel(model);
          this.goodsPanel.visible = true;
        }
        showBattlePanel(ch1, ch2, onWin, onFail, onCancel) {
          this.battlePanel.show(ch1, ch2, onWin, onFail, onCancel);
        }
        showMessageBox(title, content, fn) {
          this.messageBox.show(title, content);
          if (fn) {
            this.messageBox.onMessageBoxDismiss = fn;
          }
        }
      };
      exports.default = SimpleScene;
    }
  });

  // js/schedule/sequence.js
  var require_sequence = __commonJS({
    "js/schedule/sequence.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Sequence = void 0;
      var Sequence = class {
        constructor() {
          this.items = new Array();
          this.currentIndex = 0;
        }
        addIntoSequence(item) {
          this.items.push(item);
        }
        startOne() {
          if (this.currentIndex < this.items.length) {
            let item = this.items[this.currentIndex];
            item.onStart();
          }
        }
        next() {
          if (this.currentIndex >= this.items.length - 1) {
            return;
          }
          this.currentIndex++;
          this.startOne();
        }
        reset() {
          this.currentIndex = 0;
        }
      };
      exports.Sequence = Sequence;
    }
  });

  // js/game/data/structure/flow.js
  var require_flow = __commonJS({
    "js/game/data/structure/flow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Flow = void 0;
      var assertion_1 = require_assertion();
      var sequence_1 = require_sequence();
      var Flow = class {
        constructor() {
          this.sequence = new sequence_1.Sequence();
          this.addDialogue = void 0;
          this.showOptionView = void 0;
          this.setOnDialogueFinished = void 0;
          this.hideDialogue = void 0;
        }
        bind(scene) {
          this.addDialogue = scene.addDialogue.bind(scene);
          this.showOptionView = scene.showOptionView.bind(scene);
          this.setOnDialogueFinished = scene.setOnDialogueFinish.bind(scene);
          this.hideDialogue = scene.hideDialogue.bind(scene);
        }
        reset() {
          this.sequence.reset();
        }
        startFlow() {
          assertion_1.default.expectTrue(this.addDialogue != void 0);
          this.sequence.startOne();
        }
      };
      exports.Flow = Flow;
    }
  });

  // js/compose/place_and_people_view.js
  var require_place_and_people_view = __commonJS({
    "js/compose/place_and_people_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PlaceAndPeopleView = exports.Place = exports.People = void 0;
      var bindable_data_1 = require_bindable_data();
      var character_1 = require_character();
      var layout_1 = require_layout();
      var imageview_1 = require_imageview();
      var linear_layout_1 = require_linear_layout();
      var panel_1 = require_panel();
      var People = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.showNoteSign = false;
          this.pointerPosition = imageview_1.PointerPosition.NONE;
          this.character = new character_1.Character();
          this.friendship = 0;
        }
      };
      exports.People = People;
      var Place = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.showNoteSign = false;
          this.pointerPosition = imageview_1.PointerPosition.NONE;
          this.peoples = new Array();
          this.places = new Array();
          this.parent = void 0;
          this.onBackListener = void 0;
          this.onclickListener = void 0;
          this.onpressListener = void 0;
        }
      };
      exports.Place = Place;
      var PlaceAndPeopleView = class extends panel_1.default {
        constructor() {
          super();
          this.peoplePanel = new linear_layout_1.default();
          this.placePanel = new linear_layout_1.default();
          this.addView(this.peoplePanel);
          this.addView(this.placePanel);
          this.peoplePanel.layoutParam.xcfg = layout_1.Align.START;
          this.placePanel.layoutParam.xcfg = layout_1.Align.END;
        }
        updatePlace(place) {
          this.refineEvent(place);
          this.place = place;
          this.setIsDirty(true);
          this.peoplePanel.removeAllViews();
          this.placePanel.removeAllViews();
          let that = this;
          if (place && place.places) {
            place.places.forEach((p) => {
              let placeView = new imageview_1.default(p.imageSrc);
              placeView.forceWidth = 80;
              placeView.forceHeight = 80;
              placeView.margin.bottom = 10;
              placeView.bindData(p, (v, d) => {
                v.img.src = d.imageSrc;
                v.showNoteSign = d.showNoteSign;
                v.pointerPosition = d.pointerPosition;
                v.onclickInternal = () => {
                  if (d.onclickListener) {
                    d.onclickListener();
                  }
                  that.updatePlace(d);
                  return true;
                };
                v.onpressInternal = () => {
                  if (d.onpressListener) {
                    d.onpressListener();
                  }
                  return true;
                };
              });
              this.placePanel.addView(placeView);
            });
          }
          if (place && place.peoples) {
            place.peoples.forEach((p) => {
              let peopleView = new imageview_1.default(p.character.imageSrc);
              peopleView.forceWidth = 80;
              peopleView.forceHeight = 80;
              peopleView.margin.bottom = 10;
              peopleView.bindData(p, (v, d) => {
                v.img.src = d.character.imageSrc;
                v.showNoteSign = d.showNoteSign;
                v.pointerPosition = d.pointerPosition;
                v.onclickInternal = () => {
                  if (d.onclickListener) {
                    d.onclickListener();
                  }
                  return true;
                };
                v.onpressInternal = () => {
                  if (d.onpressListener) {
                    d.onpressListener();
                  }
                  if (that.showDescription) {
                    that.showDescription(d.character);
                  }
                  return true;
                };
              });
              this.peoplePanel.addView(peopleView);
            });
          }
          if (place && place.parent) {
            let backView = new imageview_1.default("res/created/back.png");
            backView.forceWidth = 80;
            backView.forceHeight = 80;
            backView.margin.bottom = 10;
            backView.onclickInternal = (event) => {
              if (place.onBackListener) {
                place.onBackListener();
              }
              that.updatePlace(place.parent);
              return true;
            };
            this.placePanel.addView(backView);
          }
          this.peoplePanel.setIsDirty(true);
          this.placePanel.setIsDirty(true);
        }
        refineEvent(place) {
          if (place && place.places) {
            place.places.forEach((child) => {
              child.parent = place;
            });
          }
        }
      };
      exports.PlaceAndPeopleView = PlaceAndPeopleView;
    }
  });

  // js/game/data/actors.js
  var require_actors = __commonJS({
    "js/game/data/actors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Actors = void 0;
      var place_and_people_view_1 = require_place_and_people_view();
      var character_1 = require_character();
      var specials_1 = require_specials();
      var Actors = class {
        constructor() {
          let businessman = new place_and_people_view_1.People();
          businessman.character.name = "\u5546\u4EBA";
          businessman.character.imageSrc = "res/copyleft/people_businessman.png";
          businessman.character.abilities[character_1.ABILITY.INTELIGENCE] = 10;
          businessman.character.specials.push(specials_1.Specials.getInstance().kouruoxuanhe);
          this.businessman = businessman;
          let fanwuji = new place_and_people_view_1.People();
          fanwuji.character.name = "\u6A0A\u4E8E\u671F";
          fanwuji.character.imageSrc = "res/copyleft/people_fanwuji.png";
          fanwuji.character.abilities[character_1.ABILITY.ATTACK] = 10;
          fanwuji.character.specials.push(specials_1.Specials.getInstance().brave);
          this.fanwuji = fanwuji;
          let juzi = new place_and_people_view_1.People();
          juzi.character.name = "\u83AB\u7FDF";
          juzi.character.imageSrc = "res/copyleft/people_juzi.png";
          juzi.character.abilities[character_1.ABILITY.LOYAL] = 10;
          juzi.character.specials.push(specials_1.Specials.getInstance().xianting, specials_1.Specials.getInstance().yiboyuntian);
          this.juzi = juzi;
          let jinke = new place_and_people_view_1.People();
          jinke.character.name = "\u8346\u8F72";
          jinke.character.imageSrc = "res/copyleft/people_juzi.png";
          this.jinke = jinke;
          let taizidan = new place_and_people_view_1.People();
          taizidan.character.name = "\u592A\u5B50\u4E39";
          taizidan.character.imageSrc = "res/copyleft/people_taizidan.png";
          taizidan.character.abilities[character_1.ABILITY.ATTACK] = 10;
          taizidan.character.abilities[character_1.ABILITY.INTELIGENCE] = -10;
          this.taizidan = taizidan;
        }
        static getInstance() {
          if (this.instance == null) {
            this.instance = new Actors();
          }
          return this.instance;
        }
      };
      exports.Actors = Actors;
      Actors.instance = new Actors();
    }
  });

  // js/game/data/act1_flows.js
  var require_act1_flows = __commonJS({
    "js/game/data/act1_flows.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Act1Flows = void 0;
      var dialogue_1 = require_dialogue();
      var textview_1 = require_textview();
      var flow_1 = require_flow();
      var option_view_1 = require_option_view();
      var option_1 = require_option();
      var actors_1 = require_actors();
      var Act1Flows = class {
        constructor() {
          this.greetingFromJuzi = this.buildGreetingFromJuzi();
        }
        static getInstance() {
          return this.instance;
        }
        buildGreetingFromJuzi() {
          let greetingFromJuzi = new flow_1.Flow();
          greetingFromJuzi.sequence.addIntoSequence({
            onStart() {
              greetingFromJuzi.addDialogue(new dialogue_1.default(actors_1.Actors.instance.juzi.character, new textview_1.Text("\u4F60\u597D\uFF0C\u597D\u4E45\u6CA1\u4EBA\u8DDF\u6211\u8BF4\u8BDD\u4E86")));
              greetingFromJuzi.addDialogue(new dialogue_1.default(actors_1.Actors.instance.juzi.character, new textview_1.Text("\u6211\u662F\u8C01\uFF1F\u8FD9\u4E0D\u91CD\u8981\uFF0C\u5C31\u5982\u540C\u6211\u8FC7\u53BB\u7684\u7406\u60F3\u3002\u4EFB\u5C71\u77F3\u963B\u96BE\uFF0C\u7EC6\u6C34\u95F4\u4E2D\u6D41\u3002\u6321\u4E0D\u4F4F\u4E86\uFF0C\u96BE\u554A\uFF0C\u96BE\u3002")));
              greetingFromJuzi.setOnDialogueFinished(() => {
                greetingFromJuzi.sequence.next();
              });
            }
          });
          greetingFromJuzi.sequence.addIntoSequence({
            onStart() {
              let callback = {
                onOptionClicked(op) {
                  switch (op) {
                    case option_1.YES_NO.YES:
                      greetingFromJuzi.addDialogue(new dialogue_1.default(actors_1.Actors.instance.juzi.character, new textview_1.Text("\u662F\u8FD9\u6837\u5417\uFF1F\u90A3\u5C31\u597D\uFF0C\u90A3\u5C31\u597D.")));
                      greetingFromJuzi.setOnDialogueFinished(() => {
                        greetingFromJuzi.hideDialogue();
                      });
                      break;
                    case option_1.YES_NO.NO:
                      greetingFromJuzi.addDialogue(new dialogue_1.default(actors_1.Actors.instance.juzi.character, new textview_1.Text("\u96BE\u554A\uFF0C\u96BE\u554A.")));
                      greetingFromJuzi.setOnDialogueFinished(() => {
                        greetingFromJuzi.hideDialogue();
                      });
                      break;
                  }
                  return true;
                }
              };
              let op1 = new option_view_1.Option(option_1.YES_NO.YES, new textview_1.Text("\u662F\u7684\uFF0C\u6211\u662F\u8FD9\u6837\u5B50\u8BA4\u4E3A\u7684"));
              let op2 = new option_view_1.Option(option_1.YES_NO.NO, new textview_1.Text("\u4E0D\u662F\uFF0C\u5F81\u6218\u6C38\u65E0\u6B62\u5883"));
              let ops = new Array();
              ops.push(op1, op2);
              greetingFromJuzi.showOptionView(new textview_1.Text("\u4F60\u89C9\u5F97\u6211\u4EEC\u6709\u751F\u4E4B\u5E74\u4F1A\u770B\u5230\u548C\u5E73\u5417\uFF1F"), ops, callback);
            }
          });
          return greetingFromJuzi;
        }
      };
      exports.Act1Flows = Act1Flows;
      Act1Flows.instance = new Act1Flows();
    }
  });

  // js/animator/meanwhile.js
  var require_meanwhile = __commonJS({
    "js/animator/meanwhile.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MeanWhileBuilder = exports.MeanWhile = void 0;
      var MeanWhile = class {
        constructor(animateList) {
          this.animateList = animateList;
        }
        update(dt) {
          let restOfDt = dt;
          this.animateList.forEach((animator) => {
            if (!animator.isStop()) {
              let rest = animator.update(dt);
              restOfDt = Math.min(rest, restOfDt);
            }
          });
          return restOfDt;
        }
        getVal() {
          let count = 0;
          this.animateList.forEach((animator) => {
            if (animator.isStop()) {
              count++;
            }
          });
          return count;
        }
        isStop() {
          return this.getVal() == this.animateList.length;
        }
        onValChange(val) {
        }
        onStop() {
        }
      };
      exports.MeanWhile = MeanWhile;
      var MeanWhileBuilder = class {
        constructor() {
          this.animators = new Array();
        }
        join(animator) {
          this.animators.push(animator);
          return this;
        }
        build() {
          return new MeanWhile(this.animators);
        }
      };
      exports.MeanWhileBuilder = MeanWhileBuilder;
    }
  });

  // js/animator/flow/caption_title_fadein_fadeout.js
  var require_caption_title_fadein_fadeout = __commonJS({
    "js/animator/flow/caption_title_fadein_fadeout.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CaptionTitleFadeInFadeOut = void 0;
      var animator_set_1 = require_animator_set();
      var meanwhile_1 = require_meanwhile();
      var text_affect_1 = require_text_affect();
      var CaptionTitleFadeInFadeOut = class {
        static getAnimator(captionView, titleView) {
          let captionFadeIn = (0, text_affect_1.textAlpha)(true, 2e3, captionView);
          let titleFadeIn = (0, text_affect_1.textAlpha)(true, 2500, titleView);
          let captionFadeOut = (0, text_affect_1.textAlpha)(false, 2e3, captionView);
          let titleFadeOut = (0, text_affect_1.textAlpha)(false, 2e3, titleView);
          let fadeOut = new meanwhile_1.MeanWhileBuilder().join(captionFadeOut).join(titleFadeOut).build();
          let animation = new animator_set_1.AnimatorSetBuilder().after(captionFadeIn).after(titleFadeIn).after(fadeOut).build();
          return animation;
        }
      };
      exports.CaptionTitleFadeInFadeOut = CaptionTitleFadeInFadeOut;
    }
  });

  // js/game/game_state.js
  var require_game_state = __commonJS({
    "js/game/game_state.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GameState = void 0;
      var GameState = class {
        constructor() {
          this.states = new Array();
        }
        static create() {
          return new GameState();
        }
        switchToNewScene(sceneName) {
          this.currentSceneName = sceneName;
          this.states = new Array();
        }
        hasEnterState(state) {
          return this.states.findIndex((item) => item == state) >= 0;
        }
        recordState(state) {
          this.states.push(state);
        }
        toParcel(p) {
          p.writeString(this.currentSceneName);
          p.writeStringArray(this.states);
        }
        fromParcel(p) {
          this.currentSceneName = p.readString();
          this.states = p.readStringArray();
        }
      };
      exports.GameState = GameState;
      GameState.instance = new GameState();
    }
  });

  // js/game/data/views/simple_scene_views.js
  var require_simple_scene_views = __commonJS({
    "js/game/data/views/simple_scene_views.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SimpleSceneViews = void 0;
      var layout_1 = require_layout();
      var textview_1 = require_textview();
      var SimpleSceneViews = class {
        static init() {
          this.sceneCaption = new textview_1.default();
          this.sceneTitle = new textview_1.default();
          this.sceneCaption.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          this.sceneTitle.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          this.sceneCaption.margin.top = -50;
          this.sceneCaption.setTransparent();
          this.sceneTitle.setTransparent();
        }
      };
      exports.SimpleSceneViews = SimpleSceneViews;
    }
  });

  // js/widgets/birdview_image.js
  var require_birdview_image = __commonJS({
    "js/widgets/birdview_image.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var simple_view_1 = require_simple_view();
      var BirdViewImage = class extends simple_view_1.default {
        constructor(src) {
          super();
          this.img = new Image();
          this.img.src = src;
          this.sx = this.sy = 0;
        }
        calculateActualSize(ctx, maxWidthForCalculation, maxHeightForCalculation) {
          return {
            calcWidth: this.img.naturalWidth,
            calcHeight: this.img.naturalHeight
          };
        }
        onLayout(parentWidth, parentHeight, left, top) {
        }
        drawToCanvasInternal(ctx) {
          ctx.drawImage(this.img, this.sx, this.sy, this.width, this.height, 0, 0, this.width, this.height);
        }
      };
      exports.default = BirdViewImage;
    }
  });

  // js/game/data/views/act1_views.js
  var require_act1_views = __commonJS({
    "js/game/data/views/act1_views.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Act1Views = void 0;
      var place_and_people_view_1 = require_place_and_people_view();
      var layout_1 = require_layout();
      var birdview_image_1 = require_birdview_image();
      var imageview_1 = require_imageview();
      var Act1Views = class {
        static init(canvasWidth, canvasHeight) {
          let cityPhoto = new birdview_image_1.default("res/city_of_yan.png");
          cityPhoto.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          cityPhoto.forceHeight = canvasHeight * 2 / 3;
          cityPhoto.layoutParam.xcfg = layout_1.Align.CENTER;
          cityPhoto.layoutParam.ycfg = layout_1.Align.CENTER;
          let placeAndPeopleView = new place_and_people_view_1.PlaceAndPeopleView();
          placeAndPeopleView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          placeAndPeopleView.margin.left = 10;
          placeAndPeopleView.margin.right = 10;
          placeAndPeopleView.margin.top = 40 + canvasHeight / 6;
          let me = new imageview_1.default("res/created/me.png");
          me.forceWidth = 30;
          me.forceHeight = 30;
          me.margin.right = 10;
          me.margin.top = 10 + canvasHeight / 6;
          me.layoutParam.xcfg = layout_1.Align.END;
          this.cityPhoto = cityPhoto;
          this.placeAndPeopleView = placeAndPeopleView;
          this.me = me;
        }
      };
      exports.Act1Views = Act1Views;
    }
  });

  // js/game/data/sequences/act1/act1_meet_quiz_flow.js
  var require_act1_meet_quiz_flow = __commonJS({
    "js/game/data/sequences/act1/act1_meet_quiz_flow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dialogue_1 = require_dialogue();
      var player_1 = require_player();
      var sequence_1 = require_sequence();
      var textview_1 = require_textview();
      var option_1 = require_option();
      var option_view_1 = require_option_view();
      var character_1 = require_character();
      var text_effects_1 = require_text_effects();
      var specials_1 = require_specials();
      var actors_1 = require_actors();
      var game_state_1 = require_game_state();
      var quest_1 = require_quest();
      var quest_data_1 = require_quest_data();
      var Act1MeetQuizFlow = class {
        static get(that) {
          let sequence = new sequence_1.Sequence();
          sequence.addIntoSequence({
            onStart() {
              that.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u8205\u8205\uFF0C\u6211\u6765\u770B\u4F60\u4E86\uFF0C\u8FD1\u6765\u53EF\u597D?")));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6211\u8FD9\u8FB9\u8FD8\u597D\uFF0C\u90A3\u4E48\u591A\u5E74\u4E0D\u89C1\uFF0C\u4F60\u5DF2\u7ECF\u8FD9\u4E48\u9AD8\u4E86."), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u8FD9\u4E9B\u5E74\u4F60\u90FD\u505A\u4E86\u4EC0\u4E48\u5462\uFF1F"), false));
              that.setOnDialogueFinish(sequence.next.bind(sequence));
            }
          });
          sequence.addIntoSequence({
            onStart() {
              let options = new Array();
              let OPT;
              (function(OPT2) {
                OPT2[OPT2["JIANSHU"] = 0] = "JIANSHU";
                OPT2[OPT2["SUZI"] = 1] = "SUZI";
                OPT2[OPT2["FANGNIU"] = 2] = "FANGNIU";
              })(OPT || (OPT = {}));
              let opt1 = new option_view_1.Option(OPT.JIANSHU, new textview_1.Text("\u5B66\u4E60\u5251\u672F(\f\u52C7\u6B66\r+3)").setDefaultEffect(text_effects_1.default.abilityEffect));
              let opt2 = new option_view_1.Option(OPT.SUZI, new textview_1.Text("\u5B66\u4E60\u82CF\u5B50\u7684\u4E66(\f\u8C0B\u7565\r+3)").setDefaultEffect(text_effects_1.default.abilityEffect));
              let opt3 = new option_view_1.Option(OPT.FANGNIU, new textview_1.Text("\u7ED9\u7239\u7239\u653E\u725B(\u83B7\u5F97\u7279\u6027\f\u6734\u7D20\r)").setDefaultEffect(text_effects_1.default.specialEffect));
              options.push(opt1, opt2, opt3);
              let callback = {
                onOptionClicked(id) {
                  switch (id) {
                    case OPT.JIANSHU:
                      player_1.Player.instance.character.abilities[character_1.ABILITY.ATTACK] += 3;
                      break;
                    case OPT.SUZI:
                      player_1.Player.instance.character.abilities[character_1.ABILITY.INTELIGENCE] += 3;
                      break;
                    case OPT.FANGNIU:
                      player_1.Player.instance.character.specials.push(specials_1.Specials.instance.simpleAndNaive);
                      player_1.Player.instance.character.dirty = true;
                      break;
                    case option_1.UNKNOWN:
                      console.log("Timeout");
                      break;
                  }
                  player_1.Player.getInstance().saveChoose(player_1.Event.FRE_WHAT_LEARN, id);
                  sequence.next();
                  return true;
                }
              };
              that.showOptionView(new textview_1.Text("\u90A3\u6BB5\u65F6\u95F4\uFF0C\u6211"), options, callback, 15);
            }
          });
          sequence.addIntoSequence({
            onStart() {
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u633A\u597D\u7684\uFF0C\u4F60\u672A\u6765\u60F3\u505A\u4EC0\u4E48\u5417\uFF1F"), false));
              that.setOnDialogueFinish(() => {
                let opt1 = new option_view_1.Option(option_1.OPTION3.OP1, new textview_1.Text("\u52AA\u529B\u594B\u6597\uFF0C\u4E3A\u592A\u5B50\u6548\u529B(\f\u592A\u5B50\u4E39\r\u7684\u597D\u611F + 80)").setDefaultEffect(text_effects_1.default.nameEffect));
                let opt2 = new option_view_1.Option(option_1.OPTION3.OP2, new textview_1.Text("\u884C\u4FA0\u4ED7\u4E49\uFF01(\u83B7\u5F97\u7279\u6280\f\u4E49\u8584\u4E91\u5929\r)").setDefaultEffect(text_effects_1.default.specialEffect));
                let opt3 = new option_view_1.Option(option_1.OPTION3.OP3, new textview_1.Text("\u8FD9\u4E16\u9053\u592A\u4E71\u4E86\uFF0C\u6211\u3002\u3002\u3002\u6211\u4E0D\u77E5\u9053"));
                let options = [opt1, opt2, opt3];
                that.showOptionView(new textview_1.Text("\u6211\u672A\u6765\u60F3\u505A\u4EC0\u4E48\uFF1F"), options, {
                  onOptionClicked(opt) {
                    switch (opt) {
                      case option_1.OPTION3.OP1:
                        actors_1.Actors.instance.taizidan.friendship += 80;
                        break;
                      case option_1.OPTION3.OP2:
                        player_1.Player.instance.character.specials.push(specials_1.Specials.instance.yiboyuntian);
                        player_1.Player.instance.character.dirty = true;
                        break;
                      case option_1.OPTION3.OP3:
                        game_state_1.GameState.instance.recordState("ConfusedAtWar");
                        break;
                    }
                    sequence.next();
                    return true;
                  }
                });
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              if (!game_state_1.GameState.instance.hasEnterState("ConfusedAtWar")) {
                sequence.next();
                return;
              }
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6211\u4EE5\u524D\u5F88\u60F3\u7EC3\u7684\u4E00\u8EAB\u597D\u6B66\u827A\uFF0C\u884C\u4FA0\u4ED7\u4E49\uFF0C\u5EFA\u529F\u7ACB\u4E1A\uFF0C\u5374\u53EA\u80FD\u653E\u6B4C\u95F9\u5E02\u4E4B\u4E2D\uFF0C\u7EC8\u4E0D\u5F97\u5FD7\u3002"), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u5E78\u5F97\u7530\u5149\u5148\u751F\uFF0C\u6211\u5F97\u4EE5\u89C1\u91CD\u4E8E\u592A\u5B50\u3002"), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u7136\u800C\u4E4B\u540E\u5404\u79CD\u4E8B\u60C5\u7684\u53D1\u751F\uFF0C\u6211\u4E5F\u5F00\u59CB\u6709\u70B9\u8FF7\u7CCA\u4E86"), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u5148\u4E0D\u804A\u8FD9\u4E86"), false));
              that.setOnDialogueFinish(() => {
                that.showMessageBox(new textview_1.Text("\u83B7\u5F97\u4EFB\u52A1\uFF1A\u8C03\u67E5\u8346\u8F72\u7684\u56F0\u60D1"), new textview_1.Text("\u8C03\u67E5\u6E05\u695A\u53D4\u53D4\u7684\u56F0\u60D1"), () => {
                  let quest = new quest_1.default();
                  quest.type = quest_data_1.QuestType.JingkeConfuzed;
                  player_1.Player.instance.quests.push(quest);
                  sequence.next();
                });
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6211\u4EEC\u8FDB\u57CE\u628A."), false));
              that.setOnDialogueFinish(() => {
                that.hideDialogue();
                sequence.next();
              });
            }
          });
          return sequence;
        }
      };
      exports.default = Act1MeetQuizFlow;
    }
  });

  // js/data/bussinessman.js
  var require_bussinessman = __commonJS({
    "js/data/bussinessman.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var goods_1 = require_goods();
      var BussinessMan = class {
        constructor() {
          this.goodsList = [];
          this.initGoodsList(this.goodsList);
        }
        toParcel(p) {
          p.writeInt(this.goodsList.length);
          this.goodsList.forEach((goods) => {
            goods.toParcel(p);
          });
        }
        fromParcel(p) {
          let length = p.readInt();
          this.goodsList.splice(0);
          for (let i = 0; i < length; i++) {
            let goods = new goods_1.Goods();
            goods.fromParcel(p);
            this.goodsList.push(goods);
          }
        }
      };
      exports.default = BussinessMan;
    }
  });

  // js/game/data/goods/simple_goods_infos.js
  var require_simple_goods_infos = __commonJS({
    "js/game/data/goods/simple_goods_infos.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var goods_1 = require_goods();
      var SimpleGoodsInfos = class {
        static init() {
          let LiuWeiWan = new goods_1.GoodsInfo();
          LiuWeiWan.name = "\u516D\u5473\u8865\u6C14\u4E38";
          LiuWeiWan.cost = 10;
          LiuWeiWan.functional_text = "\u76CA\u6C14\u6D3B\u8840\uFF0C\u795B\u75F0\u5316\u7600";
          LiuWeiWan.image = "res/created/medition.png";
          this.LiuWeiWan = LiuWeiWan;
          let QinFlag = new goods_1.GoodsInfo();
          QinFlag.name = "\u79E6\u56FD\u519B\u65D7";
          QinFlag.cost = 100;
          QinFlag.functional_text = "\u8D73\u8D73\u5927\u79E6\uFF0C\u4E00\u5F80\u65E0\u524D";
          QinFlag.image = "res/created/flag_of_qin.png";
          this.QinFlag = QinFlag;
        }
      };
      exports.default = SimpleGoodsInfos;
    }
  });

  // js/game/data/bussinessman_data/yan_bm.js
  var require_yan_bm = __commonJS({
    "js/game/data/bussinessman_data/yan_bm.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.YanBm = void 0;
      var bussinessman_1 = require_bussinessman();
      var goods_1 = require_goods();
      var simple_goods_infos_1 = require_simple_goods_infos();
      var YanBm = class extends bussinessman_1.default {
        static init() {
          this.instance = new YanBm();
        }
        initGoodsList(list) {
          list.push(new goods_1.Goods(simple_goods_infos_1.default.LiuWeiWan, 100));
          list.push(new goods_1.Goods(simple_goods_infos_1.default.QinFlag, 1));
        }
      };
      exports.YanBm = YanBm;
    }
  });

  // js/game/data/places/yan_city.js
  var require_yan_city = __commonJS({
    "js/game/data/places/yan_city.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var goods_panel_1 = require_goods_panel();
      var place_and_people_view_1 = require_place_and_people_view();
      var actors_1 = require_actors();
      var yan_bm_1 = require_yan_bm();
      var YanCity = class {
        static init(that) {
          let mainPlace = new place_and_people_view_1.Place();
          let palace = new place_and_people_view_1.Place();
          let market = new place_and_people_view_1.Place();
          palace.imageSrc = "res/copyleft/place_yan_palace.png";
          market.imageSrc = "res/copyleft/place_market.png";
          palace.onpressListener = () => {
            console.log("This is the palace of Prince Dan");
          };
          market.onpressListener = () => {
            console.log("This is the place for poors");
          };
          palace.peoples.push(actors_1.Actors.getInstance().fanwuji);
          mainPlace.peoples.push(actors_1.Actors.getInstance().juzi);
          market.peoples.push(actors_1.Actors.getInstance().businessman);
          mainPlace.places.push(palace, market);
          actors_1.Actors.getInstance().businessman.onclickListener = () => {
            let model = new goods_panel_1.GoodsPanelModel();
            model.goodsList = yan_bm_1.YanBm.instance.goodsList;
            that.showGoodsPanel(model);
          };
          this.city = mainPlace;
          this.market = market;
          this.palace = palace;
        }
      };
      exports.default = YanCity;
    }
  });

  // js/game/data/sequences/act1/act1_enter_the_city_flow.js
  var require_act1_enter_the_city_flow = __commonJS({
    "js/game/data/sequences/act1/act1_enter_the_city_flow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var animator_set_1 = require_animator_set();
      var number_linear_animator_1 = require_number_linear_animator();
      var timeout_1 = require_timeout();
      var dialogue_1 = require_dialogue();
      var player_1 = require_player();
      var sequence_1 = require_sequence();
      var imageview_1 = require_imageview();
      var richtext_1 = require_richtext();
      var textview_1 = require_textview();
      var actors_1 = require_actors();
      var yan_city_1 = require_yan_city();
      var Act1EnterTheCityFlow = class {
        static get(that, cityPhoto, placeAndPeopleView, me) {
          let sequence = new sequence_1.Sequence();
          let city = yan_city_1.default.city;
          let market = yan_city_1.default.market;
          let palace = yan_city_1.default.palace;
          sequence.addIntoSequence({
            onStart() {
              let timeout = new timeout_1.default(1e3);
              let timeout2 = new timeout_1.default(1e3);
              let scanAnimate1 = new number_linear_animator_1.default(0, 100, 2e3);
              scanAnimate1.onValChange = (val) => {
                cityPhoto.sx = val;
              };
              let scanAnimate2 = scanAnimate1.reverse();
              scanAnimate2.onValChange = scanAnimate1.onValChange;
              let scanAnimation = new animator_set_1.AnimatorSetBuilder().after(timeout).after(scanAnimate1).after(timeout2).after(scanAnimate2).build();
              scanAnimation.onStop = () => {
                sequence.next();
              };
              that.addAnimator(scanAnimation);
            }
          });
          sequence.addIntoSequence({
            onStart() {
              that.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u5927\u90FD\u771F\u5927\u554A\uFF0C\u4EBA\u4E5F\u6709\u5F88\u591A")));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u5475\u5475\uFF0C\u8FC7\u6BB5\u65F6\u95F4\u4F60\u5C31\u4F1A\u4E60\u60EF\u7684"), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6211\u7ED9\u4F60\u4ECB\u7ECD\u8FD9\u4E0A\u9762\u7684\u4F4F\u6240\u4EE5\u53CA\u6709\u4EC0\u4E48\u4EBA"), false));
              that.setOnDialogueFinish(() => {
                sequence.next();
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              palace.pointerPosition = imageview_1.PointerPosition.LEFT;
              placeAndPeopleView.updatePlace(city);
              me.visible = true;
              let peopleEffect = new richtext_1.BgText("green", "white");
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u8FD9\u4E2A\u662F\u592A\u5B50\u4E39\u7684\u4F4F\u6240\uFF0C\u4F60\u53EF\u4EE5\u5728\u91CC\u9762\u627E\u5230\f\u592A\u5B50\u4E39\r\f\u6A0A\u4E8E\u671F\r\u5176\u4ED6\u95E8\u5BA2\u8FD8\u6709\u6211").setDefaultEffect(peopleEffect), false));
              that.setOnDialogueFinish(() => {
                palace.pointerPosition = imageview_1.PointerPosition.NONE;
                palace.dirty = true;
                sequence.next();
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              market.pointerPosition = imageview_1.PointerPosition.LEFT;
              market.dirty = true;
              let peopleEffect = new richtext_1.BgText("green", "white");
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u800C\u4E0B\u9762\u662F\u96C6\u5E02\uFF0C\u6211\u7684\u597D\u670B\u53CB\f\u9AD8\u6E10\u79BB\r\uFF0C\f\u72D7\u5C60\r\u4E5F\u5728\u90A3\u91CC\uFF0C\u4F60\u6709\u4EC0\u4E48\u8981\u4E70\u7684\uFF0C\u90FD\u53EF\u4EE5\u53BB\u8FD9\u4E70\uFF0C\u5E94\u8BE5\u90FD\u80FD\u4E70\u5230").setDefaultEffect(peopleEffect), false));
              that.setOnDialogueFinish(() => {
                market.pointerPosition = imageview_1.PointerPosition.NONE;
                market.dirty = true;
                sequence.next();
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              let juzi = actors_1.Actors.getInstance().juzi;
              juzi.pointerPosition = imageview_1.PointerPosition.RIGHT;
              juzi.dirty = true;
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u53F3\u8FB9\u680F\u76EE\u662F\u8FD9\u4E2A\u5730\u65B9\u7684\u4EBA\u7269\uFF0C\u957F\u6309\u53EF\u4EE5\u770B\u8FD9\u4E2A\u4EBA\u7684\u63CF\u8FF0\uFF0C\u70B9\u51FB\u53EF\u4EE5\u4E0E\u4E4B\u4E92\u52A8\uFF0C\u5F85\u4F1A\u53EF\u4EE5\u8BD5\u4E00\u4E0B"), false));
              that.setOnDialogueFinish(() => {
                juzi.pointerPosition = imageview_1.PointerPosition.NONE;
                juzi.dirty = true;
                palace.showNoteSign = true;
                palace.dirty = true;
                sequence.next();
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6CE8\u610F\u5230\u592A\u5B50\u5E9C\u53F3\u4E0A\u89D2\u6709\u4E2A\u60CA\u53F9\u53F7\uFF0C\u67D0\u4E9B\u4EBA\u7269\u5934\u50CF\u4E5F\u53EF\u80FD\u6709\u60CA\u53F9\u53F7\uFF0C\u8FD9\u8868\u793A\u70B9\u51FB\u5219\u4F1A\u89E6\u53D1\u5267\u60C5"), false));
              that.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6211\u4EEC\u4E00\u8D77\u53BB\u592A\u5B50\u5E9C\u628A"), false));
              that.setOnDialogueFinish(() => {
                that.hideDialogue();
                sequence.next();
              });
            }
          });
          return sequence;
        }
      };
      exports.default = Act1EnterTheCityFlow;
    }
  });

  // js/game/data/sequences/act1/act1_taizifu_greeting.js
  var require_act1_taizifu_greeting = __commonJS({
    "js/game/data/sequences/act1/act1_taizifu_greeting.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dialogue_1 = require_dialogue();
      var player_1 = require_player();
      var quest_1 = require_quest();
      var quest_data_1 = require_quest_data();
      var specials_1 = require_specials();
      var sequence_1 = require_sequence();
      var db_manager_1 = require_db_manager();
      var textview_1 = require_textview();
      var actors_1 = require_actors();
      var text_effects_1 = require_text_effects();
      var Act1TaizifuGreeting = class {
        static get(scene) {
          let sequence = new sequence_1.Sequence();
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.taizidan.character, new textview_1.Text("\u8346\u5148\u751F\uFF0C\u4F60\u56DE\u6765\u5F97\u6B63\u597D\uFF0C\u6211\u6709\u8981\u4E8B\u8DDF\u4F60\u5546\u91CF"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.taizidan.character, new textview_1.Text("\u8FD9\u4F4D\u662F? (\u6307\u7740\u4F60)"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u8FD9\u662F\u6211\u7684\u4F84\u5B50")));
              if (actors_1.Actors.instance.taizidan.friendship > 60) {
                scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.taizidan.character, new textview_1.Text("\u771F\u662F\u4E00\u8868\u4EBA\u624D\uFF0C\u5728\u8FD9\u5EA7\u57CE\u91CC\uFF0C\u4F60\u4E70\u4EFB\u4F55\u4E1C\u897F\u90FD\u7B97\u6211\u7684"), false));
                scene.setOnDialogueFinish(() => {
                  player_1.Player.instance.character.specials.push(specials_1.Specials.instance.taizidandeenchong);
                  db_manager_1.default.getInstance().save();
                  scene.showMessageBox(new textview_1.Text("\u83B7\u5F97\u7279\u6280 \u592A\u5B50\u4E39\u7684\u6069\u5BA0"), new textview_1.Text("\u5728\u71D5\u57CE\u4E1C\u897F\u968F\u4FBF\u62FF\uFF0C\u7406\u8BBA\u4E0A\u4ED6\u4EEC\u90FD\u4F1A\u627E\u592A\u5B50\u4E39\u8981\u94B1\uFF0C\u7406\u8BBA\u4E0A\u3002"), () => {
                    sequence.next();
                  });
                });
              } else {
                scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.taizidan.character, new textview_1.Text("\u771F\u662F\u4E00\u8868\u4EBA\u624D\uFF0C\u4E0D\u9519\u4E0D\u9519"), false));
                scene.setOnDialogueFinish(() => {
                  sequence.next();
                });
              }
            }
          });
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.taizidan.character, new textview_1.Text("\u8346\u5148\u751F\uFF0C\u4F60\u6574\u987F\u597D\u8FD9\u4F4D\u5C11\u4FA0\u540E\uFF0C\u6765\u6211\u623F\u91CC\uFF0C\u6211\u6709\u4E8B\u60C5\u8981\u8DDF\u4F60\u5546\u91CF\uFF0C\u5148\u8D70\u4E86"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u597D")));
              scene.setOnDialogueFinish(() => {
                scene.showMessageBox(new textview_1.Text("\u592A\u5B50\u5DF2\u7ECF\u8FDC\u53BB"), new textview_1.Text(""), () => {
                  sequence.next();
                });
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              scene.showMessageBox(new textview_1.Text("\u8346\u8F72\u8F7B\u53F9\u4E00\u58F0"), new textview_1.Text(""), () => {
                sequence.next();
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u8205\u8205\uFF0C\u600E\u4E48\u4E86\uFF1F")));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u6CA1\u4E8B\uFF0C\u5C31\u662F\u6709\u70B9\u7D2F\u4E86"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u4F60\u53EF\u4EE5\u53BB\u57CE\u91CC\u8F6C\u4E00\u4E0B\uFF0C\u6211\u53BB\u529E\u70B9\u4E8B\uFF0C\u5F85\u4F1A\u627E\u4F60\u3002"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.jinke.character, new textview_1.Text("\u5BF9\u4E86\uFF0C\u6211\u9152\u58F6\u6CA1\u9152\u4E86\uFF0C\u4F60\u5E2E\u6211\u4E70\u4E00\u4E0B \f\u71D5\u6D4A\u9152\r").setDefaultEffect(text_effects_1.default.goodsEffect), false));
              scene.setOnDialogueFinish(() => {
                player_1.Player.instance.money += 200;
                scene.showMessageBox(new textview_1.Text(""), new textview_1.Text("\u91D1\u94B1 + 200"), () => {
                  let quest = new quest_1.default();
                  quest.type = quest_data_1.QuestType.BuyWineForJingke;
                  player_1.Player.instance.quests.push(quest);
                  db_manager_1.default.getInstance().save();
                  scene.showMessageBox(new textview_1.Text("\u83B7\u5F97\u4EFB\u52A1\uFF1A \u4E70\u71D5\u6D4A\u9152"), new textview_1.Text("\u71D5\u591A\u82E6\u5BD2\u4E4B\u5730\uFF0C\u71D5\u58F0\u60B2\u6006\uFF0C\u71D5\u9152\u9AD8\u70C8"), () => {
                    scene.showMessageBox(new textview_1.Text("\uFF08\u8346\u8F72\u79BB\u53BB\uFF09"), new textview_1.Text(""), () => {
                      sequence.next();
                    });
                  });
                });
              });
            }
          });
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\uFF08\u5947\u602A\uFF0C\u8205\u8205\u600E\u4E48\u521A\u521A\u795E\u60C5\u604D\u60DA\uFF0C\u4ED6\u662F\u6709\u4EC0\u4E48\u5FC3\u4E8B\u5417\uFF1F\uFF09")));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\uFF08\u8205\u8205\u6B66\u529F\u5F88\u597D\uFF0C\u4EBA\u4E5F\u5F88\u806A\u660E\uFF0C\u6751\u91CC\u7684\u5C0F\u5B69\u90FD\u662F\u4EE5\u4ED6\u4E3A\u699C\u6837\uFF09")));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\uFF08\u7B2C\u4E00\u6B21\u770B\u5230\u8205\u8205\u5982\u6B64\uFF0C\u4F30\u8BA1\u662F\u9047\u4E0A\u4EC0\u4E48\u4E8B\u4E86\uFF0C\u6211\u8981\u6253\u63A2\u4E00\u4E0B\uFF0C\u5E2E\u5E2E\u4ED6\u3002\uFF09")));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u4E0D\u8FC7\u73B0\u5728\u7684\u6211\u4E5F\u53EA\u80FD\u5E2E\u4ED6\u4E70\u9152\u4E86\uFF08\u82E6\u7B11\uFF09")));
              scene.setOnDialogueFinish(() => {
                scene.showMessageBox(new textview_1.Text("\u83B7\u5F97\u4EFB\u52A1 \u8346\u8F72\u7684\u53F9\u606F"), new textview_1.Text("\u4F60\u4ECE\u5C0F\u542C\u8BF4\u8205\u8205\u662F\u4E00\u4E2A\u6709\u5FD7\u5411\u4E86\u4E0D\u8D77\u7684\u4EBA\uFF0C\u4ED6\u662F\u53D1\u751F\u4EC0\u4E48\u4E8B\u4E86\u5417\uFF1F\u4F60\u60F3\u8C03\u67E5\u4E00\u4E0B\uFF0C\u5E76\u5E2E\u52A9\u4ED6"), () => {
                  let quest = new quest_1.default();
                  quest.type = quest_data_1.QuestType.JingkeConfuzed;
                  player_1.Player.instance.quests.push(quest);
                  scene.hideDialogue();
                  sequence.next();
                });
              });
            }
          });
          return sequence;
        }
      };
      exports.default = Act1TaizifuGreeting;
    }
  });

  // js/game/data/sequences/act1/act1_buy_yan_wine_from_bm.js
  var require_act1_buy_yan_wine_from_bm = __commonJS({
    "js/game/data/sequences/act1/act1_buy_yan_wine_from_bm.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dialogue_1 = require_dialogue();
      var player_1 = require_player();
      var sequence_1 = require_sequence();
      var textview_1 = require_textview();
      var actors_1 = require_actors();
      var text_effects_1 = require_text_effects();
      var Act1BuyYanWineFromBm = class {
        static get(scene) {
          let sequence = new sequence_1.Sequence();
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u5BA2\u5B98\uFF0C\u8BF7\u95EE\u4F60\u60F3\u8981\u4EC0\u4E48"), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u638C\u67DC\u7684\uFF0C\u8BF7\u95EE\u4F60\u6709\f\u71D5\u6D4A\u9152\r\u5356\u5417\uFF1F").setDefaultEffect(text_effects_1.default.goodsEffect)));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u8FD9\u4F4D\u5BA2\u5B98\u4F60\u771F\u8BC6\u8D27\uFF0C\u8FD9\u4E2A\u71D5\u6D4A\u9152\uFF0C\u6027\u70C8\uFF0C\u5473\u7EAF\uFF0C\u5176\u4ED6\u56FD\u5BB6\u7684\u4EBA\u8FD8\u771F\u54C1\u4E0D\u51FA\u6765\uFF0C\u53EA\u53EF\u60DC..."), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u53EF\u60DC\u4EC0\u4E48\uFF1F")));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u53EA\u53EF\u60DC\u8FD9\u6BB5\u65F6\u95F4\u5F80\u4E1C\u4E61\u7684\u8DEF\uFF0C\u7ECF\u5E38\u6709\u864E\u51FA\u6CA1\uFF0C\u6765\u5F80\u5546\u4EBA\u5C11\u4E86\uFF0C\u8FD9\u9152\u4E5F\u5C31\u6765\u4E0D\u53CA\u8FDB\u8D27\uFF0C\u6240\u4EE5\u5B58\u8D27\u4E0D\u591A"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u4ECA\u65E9\uFF0C\f\u6A0A\u4E8E\u671F\r\u5927\u7237\u4E70\u8D70\u6700\u540E\u7684\u4FE9\u74F6\uFF0C\u6240\u4EE5\u5C31\u6CA1\u4E86").setDefaultEffect(text_effects_1.default.nameEffect), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u662F\f\u592A\u5B50\u5E9C\r\u90A3\u4F4D\u5417\uFF1F").setDefaultEffect(text_effects_1.default.placeEffect)));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u6B63\u662F"), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u591A\u8C22\u544A\u77E5\uFF0C\u544A\u8F9E")));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.businessman.character, new textview_1.Text("\u5BA2\u5B98\u6162\u8D70\uFF0C\u6211\u8FD9\u6709\u5F88\u591A\u836F\u6750\u76D4\u7532\uFF0C\u4F60\u9700\u8981\u7684\u65F6\u5019\u968F\u65F6\u6765\u6211\u8FD9\u4E70..."), false));
              scene.setOnDialogueFinish(() => {
                sequence.next();
              });
            }
          });
          return sequence;
        }
      };
      exports.default = Act1BuyYanWineFromBm;
    }
  });

  // js/game/data/sequences/act1/act1_buy_yan_wine_fanwuji_first_flow.js
  var require_act1_buy_yan_wine_fanwuji_first_flow = __commonJS({
    "js/game/data/sequences/act1/act1_buy_yan_wine_fanwuji_first_flow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dialogue_1 = require_dialogue();
      var player_1 = require_player();
      var sequence_1 = require_sequence();
      var textview_1 = require_textview();
      var actors_1 = require_actors();
      var text_effects_1 = require_text_effects();
      var Act1BuyYanWineFanwujiFirstFlow = class {
        static get(scene) {
          let sequence = new sequence_1.Sequence();
          sequence.addIntoSequence({
            onStart() {
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u9152\u5165\u6101\u80A0\uFF0C\u5316\u4F5C\u76F8\u601D\u6CEA (\u4E00\u996E\u800C\u5C3D)"), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u6A0A\u5C06\u519B\uFF0C\u6211\u9700\u8981\u60A8\u624B\u4E2D\u7684\f\u71D5\u6D4A\u9152\r, \u4E0D\u77E5\u5148\u751F\u53EF\u5426\u5272\u7231").setDefaultEffect(text_effects_1.default.goodsEffect)));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u6211\u6B63\u597D\u5269\u4E00\u74F6\uFF0C\u8981\u662F\u5BFB\u5E38\u7269\u54C1\uFF0C\u4F60\u53EA\u7BA1\u53D6\u8D70\u5C31\u662F\u3002\u8FD9\u9152\uFF0C\u80FD\u89E3\u76F8\u601D\u4E4B\u6101\uFF0C\u6055\u6211\u4E0D\u80FD\u8BA9"), false));
              scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u6A0A\u5C06\u519B\uFF0C\u60A8\u6709\u4EC0\u4E48\u5FE7\u6101\u4E4B\u4E8B\uFF0C\u53EA\u7BA1\u8BF4\u51FA\u6765\uFF0C\u6211\u5C3D\u529B\u4E3A\u60A8\u6D88\u9664\uFF0C\u4E8B\u6210\u4E4B\u540E\uFF0C\u60A8\u80FD\u5C06\u9152\u7ED9\u6211\u5417\uFF1F")));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u6211\u662F\u5BB6\u4EC7\u8840\u6068\uFF0C\u6055\u6211\u5192\u6627\uFF0C\u4F60\u786E\u5B9E\u5E2E\u4E0D\u4E86\u6211\u3002\u770B\u5728\u4F60\u8FD9\u4E48\u60F3\u8981\u8FD9\u9152\uFF0C\u6211\u4E5F\u597D\u4E45\u6CA1\u6709\u6D3B\u52A8\u624B\u811A\u4E86\uFF0C\u5982\u679C\u4F60\u80FD\u80DC\u6211\uFF0C\u8FD9\u9152\u5C31\u662F\u4F60\u7684\u3002\u770B\u5728\u4F60\u662F\u5E74\u8F7B\u4EBA\uFF0C\u6211\u53EA\u51FA\u4E09\u5206\u529B"), false));
              scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u4F60\u53EF\u4EE5\u5728\u4F60\u51C6\u5907\u597D\u7684\u65F6\u5019\u627E\u6211\u3002"), false));
              scene.setOnDialogueFinish(() => {
                scene.hideDialogue();
                sequence.next();
              });
            }
          });
          return sequence;
        }
      };
      exports.default = Act1BuyYanWineFanwujiFirstFlow;
    }
  });

  // js/game/act1.js
  var require_act1 = __commonJS({
    "js/game/act1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var animator_set_1 = require_animator_set();
      var text_affect_1 = require_text_affect();
      var timeout_1 = require_timeout();
      var dialogue_1 = require_dialogue();
      var layout_1 = require_layout();
      var simple_scene_1 = require_simple_scene();
      var textview_1 = require_textview();
      var act1_flows_1 = require_act1_flows();
      var actors_1 = require_actors();
      var caption_title_fadein_fadeout_1 = require_caption_title_fadein_fadeout();
      var game_state_1 = require_game_state();
      var db_manager_1 = require_db_manager();
      var simple_scene_views_1 = require_simple_scene_views();
      var act1_views_1 = require_act1_views();
      var act1_meet_quiz_flow_1 = require_act1_meet_quiz_flow();
      var act1_enter_the_city_flow_1 = require_act1_enter_the_city_flow();
      var yan_city_1 = require_yan_city();
      var act1_taizifu_greeting_1 = require_act1_taizifu_greeting();
      var act1_buy_yan_wine_from_bm_1 = require_act1_buy_yan_wine_from_bm();
      var act1_buy_yan_wine_fanwuji_first_flow_1 = require_act1_buy_yan_wine_fanwuji_first_flow();
      var sequence_1 = require_sequence();
      var player_1 = require_player();
      var Act1 = class extends simple_scene_1.default {
        onStart(ctx) {
          super.onStart(ctx);
          simple_scene_views_1.SimpleSceneViews.init();
          yan_city_1.default.init(this);
          if (!game_state_1.GameState.instance.hasEnterState("act1_opening")) {
            let sceneCaption = simple_scene_views_1.SimpleSceneViews.sceneCaption;
            let sceneTitle = simple_scene_views_1.SimpleSceneViews.sceneTitle;
            sceneCaption.setText(new textview_1.Text("Act 01"));
            sceneTitle.setText(new textview_1.Text("\u5317\u98CE\u8D77, \u9EC4\u82B1\u6EE1\u5730"));
            this.addView(sceneCaption);
            this.addView(sceneTitle);
            this.forceRepaint();
            let animation = caption_title_fadein_fadeout_1.CaptionTitleFadeInFadeOut.getAnimator(sceneCaption, sceneTitle);
            animation.onStop = () => {
              game_state_1.GameState.instance.recordState("act1_opening");
              db_manager_1.default.getInstance().save();
              this.showDescription();
            };
            this.addAnimator(animation);
          } else {
            this.showFirstMeetDialogues();
          }
        }
        showDescription() {
          let desc = new textview_1.default();
          desc.setText(new textview_1.Text("\u6218\u56FD\u672B\u5E74\uFF0C\u79E6\u56FD\u541E\u5E76\u97E9\u8D75\uFF0C\u52BF\u903C\u71D5\u56FD\u3002\u5728\u6B64\u4E4B\u9645\uFF0C\u71D5\u592A\u5B50\u4E39\u8BB0\u6302\u7740\u8D28\u4E8E\u79E6\u7684\u79C1\u4EC7\u3002\u4F60\u6B63\u6295\u5954\u5728\u592A\u5B50\u505A\u95E8\u5BA2\u7684\u8205\u8205\uFF0C\u8346\u8F72"));
          desc.layoutParam.xcfg = layout_1.Align.CENTER;
          desc.layoutParam.ycfg = layout_1.Align.CENTER;
          desc.padding.left = desc.padding.right = 30;
          this.addView(desc);
          this.forceRepaint();
          let that = this;
          desc.setTransparent();
          let showDesc = (0, text_affect_1.textAlpha)(true, 500, desc);
          let timeout = new timeout_1.default(6500);
          let dismissDesc = (0, text_affect_1.textAlpha)(false, 500, desc);
          let descAnimationSet = new animator_set_1.AnimatorSetBuilder().after(showDesc).after(timeout).after(dismissDesc).build();
          descAnimationSet.onStop = () => {
            that.showFirstMeetDialogues();
          };
          this.addAnimator(descAnimationSet);
        }
        showFirstMeetDialogues() {
          if (!game_state_1.GameState.instance.hasEnterState("first_meet_quiz")) {
            let that = this;
            let firstMeetSequence = act1_meet_quiz_flow_1.default.get(this);
            firstMeetSequence.addIntoSequence({
              onStart() {
                game_state_1.GameState.instance.recordState("first_meet_quiz");
                that.setupMainPanel();
              }
            });
            firstMeetSequence.startOne();
          } else {
            this.setupMainPanel();
          }
        }
        setupMainPanel() {
          act1_views_1.Act1Views.init(this.canvasWidth, this.canvasHeight);
          let cityPhoto = act1_views_1.Act1Views.cityPhoto;
          let placeAndPeopleView = act1_views_1.Act1Views.placeAndPeopleView;
          let me = act1_views_1.Act1Views.me;
          placeAndPeopleView.showDescription = this.showCharacterDescription.bind(this);
          me.onclickInternal = (event) => {
            this.showUserPanel();
            return true;
          };
          me.visible = false;
          this.addView(cityPhoto);
          this.addView(me);
          this.addView(placeAndPeopleView);
          this.forceRepaint();
          let juziFlow = act1_flows_1.Act1Flows.getInstance().greetingFromJuzi;
          juziFlow.bind(this);
          actors_1.Actors.getInstance().juzi.onclickListener = () => {
            juziFlow.reset();
            juziFlow.startFlow();
          };
          let that = this;
          if (!game_state_1.GameState.instance.hasEnterState("enter_city")) {
            let sequence = act1_enter_the_city_flow_1.default.get(that, cityPhoto, placeAndPeopleView, me);
            sequence.addIntoSequence({
              onStart() {
                that.onEnterCity();
                game_state_1.GameState.instance.recordState("enter_city");
                db_manager_1.default.getInstance().save();
              }
            });
            sequence.startOne();
          } else {
            placeAndPeopleView.updatePlace(yan_city_1.default.city);
            me.visible = true;
            that.onEnterCity();
          }
        }
        onEnterCity() {
          let that = this;
          if (!game_state_1.GameState.instance.hasEnterState("enter_taizi_house")) {
            yan_city_1.default.palace.showNoteSign = true;
            yan_city_1.default.palace.dirty = true;
            yan_city_1.default.palace.onclickListener = () => {
              let sequence = act1_taizifu_greeting_1.default.get(that);
              sequence.addIntoSequence({
                onStart() {
                  yan_city_1.default.palace.showNoteSign = false;
                  game_state_1.GameState.instance.recordState("enter_taizi_house");
                  db_manager_1.default.getInstance().save();
                  yan_city_1.default.palace.onclickListener = () => {
                  };
                  that.wineBussinessmanFlow();
                }
              });
              sequence.startOne();
            };
          } else {
            this.wineBussinessmanFlow();
          }
        }
        wineBussinessmanFlow() {
          let that = this;
          if (!game_state_1.GameState.instance.hasEnterState("yan_wine_bussinessman")) {
            yan_city_1.default.market.showNoteSign = true;
            yan_city_1.default.market.dirty = true;
            yan_city_1.default.market.onclickListener = () => {
              let sequence = act1_buy_yan_wine_from_bm_1.default.get(that);
              sequence.addIntoSequence({
                onStart() {
                  that.hideDialogue();
                  yan_city_1.default.market.showNoteSign = false;
                  game_state_1.GameState.instance.recordState("yan_wine_bussinessman");
                  db_manager_1.default.getInstance().save();
                  yan_city_1.default.market.onclickListener = () => {
                  };
                  that.wineFanwujiFirstMeetFlow();
                }
              });
              sequence.startOne();
            };
          } else {
            that.wineFanwujiFirstMeetFlow();
          }
        }
        wineFanwujiFirstMeetFlow() {
          let that = this;
          if (!game_state_1.GameState.instance.hasEnterState("yan_wine_fanwuji_first")) {
            actors_1.Actors.instance.fanwuji.showNoteSign = true;
            actors_1.Actors.instance.fanwuji.onclickListener = () => {
              let sequence = act1_buy_yan_wine_fanwuji_first_flow_1.default.get(that);
              sequence.addIntoSequence({
                onStart() {
                  game_state_1.GameState.instance.recordState("yan_wine_fanwuji_first");
                  db_manager_1.default.getInstance().save();
                  actors_1.Actors.instance.fanwuji.onclickListener = () => {
                  };
                  that.wineFanwujiBattleFlow();
                }
              });
              sequence.startOne();
            };
          } else {
            that.wineFanwujiBattleFlow();
          }
        }
        wineFanwujiBattleFlow() {
          let scene = this;
          if (!game_state_1.GameState.instance.hasEnterState("yan_wine_fanwuji_battle")) {
            actors_1.Actors.instance.fanwuji.showNoteSign = true;
            actors_1.Actors.instance.fanwuji.onclickListener = () => {
              let sequence = new sequence_1.Sequence();
              sequence.addIntoSequence({
                onStart() {
                  scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u4F60\u51C6\u5907\u597D\u4E86\u5417\uFF1F")));
                  scene.setOnDialogueFinish(() => {
                    sequence.next();
                  });
                }
              });
              sequence.addIntoSequence({
                onStart() {
                  scene.showBattlePanel(player_1.Player.instance.character, actors_1.Actors.instance.fanwuji.character, () => {
                    scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u606D\u559C\u4F60\uFF0C\u8FD9\u58F6\u9152\u4F60\u62FF\u53BB\u628A"), false));
                    scene.addDialogue(new dialogue_1.default(player_1.Player.instance.character, new textview_1.Text("\u591A\u8C22\u5148\u751F")));
                    scene.setOnDialogueFinish(() => {
                      scene.hideDialogue();
                      actors_1.Actors.instance.fanwuji.showNoteSign = false;
                      actors_1.Actors.instance.fanwuji.dirty = true;
                      actors_1.Actors.instance.fanwuji.onclickListener = () => {
                      };
                      sequence.next();
                    });
                  }, () => {
                    scene.addDialogue(new dialogue_1.default(actors_1.Actors.instance.fanwuji.character, new textview_1.Text("\u770B\u6765\u4F60\u8FD8\u5F97\u52AA\u529B\u554A"), false));
                    scene.setOnDialogueFinish(() => {
                      scene.hideDialogue();
                      sequence.next();
                    });
                  }, () => {
                    scene.hideDialogue();
                    sequence.next();
                  });
                }
              });
              sequence.startOne();
            };
          }
        }
      };
      exports.default = Act1;
    }
  });

  // js/scene/scene_manager.js
  var require_scene_manager = __commonJS({
    "js/scene/scene_manager.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var SceneManager = class {
        constructor(ctx) {
          this.ctx = ctx;
          this.sceneMap = /* @__PURE__ */ new Map();
        }
        static getInstance() {
          return this.sInstance;
        }
        static init(ctx) {
          this.sInstance = new SceneManager(ctx);
        }
        push(key, scene) {
          if (this.sceneMap.has(key)) {
            console.warn(`conflict to push scene ${key} ${scene}`);
            return false;
          }
          this.sceneMap.set(key, scene);
        }
        remove(key) {
          if (!this.sceneMap.has(key)) {
            return false;
          }
          return this.sceneMap.delete(key);
        }
        switchScene(key) {
          if (!this.sceneMap.has(key)) {
            console.warn(`switchScene to key ${key} which has no scene related`);
            return;
          }
          this.currentScene = this.sceneMap.get(key);
          this.currentScene.onStart(this.ctx);
        }
      };
      exports.default = SceneManager;
    }
  });

  // js/misc/string_utils.js
  var require_string_utils = __commonJS({
    "js/misc/string_utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StringUtils = void 0;
      var StringUtils = class {
        static isEmpty(str) {
          return !(str && str.length > 0);
        }
      };
      exports.StringUtils = StringUtils;
    }
  });

  // js/game/welcome-scene.js
  var require_welcome_scene = __commonJS({
    "js/game/welcome-scene.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var number_linear_animator_1 = require_number_linear_animator();
      var layout_1 = require_layout();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var scene_manager_1 = require_scene_manager();
      var linear_layout_1 = require_linear_layout();
      var sprite_1 = require_sprite();
      var db_manager_1 = require_db_manager();
      var game_state_1 = require_game_state();
      var string_utils_1 = require_string_utils();
      var colors_1 = require_colors();
      var WelcomeScene = class {
        constructor(canvas2) {
          this.mainPanel = new panel_1.default();
          this.mainPanel.forceWidth = canvas2.width;
          this.mainPanel.forceHeight = canvas2.height;
          this.animators = new Array();
          this.canvasWidth = canvas2.width;
          this.canvasHeight = canvas2.height;
          this.title = new textview_1.default(new textview_1.Text("\u8346\u8F72\u523A\u79E6\u738B"));
          this.title.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          this.mainPanel.addView(this.title);
          this.title.textSize = 40;
          this.title.margin.top = -100;
          this.options = new linear_layout_1.default(linear_layout_1.Orientation.VERTICAL);
          this.options.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.options.layoutParam.xcfg = layout_1.Align.CENTER;
          this.options.layoutParam.ycfg = layout_1.Align.CENTER;
          this.options.visible = false;
          this.mainPanel.addView(this.options);
          let startBtn = new textview_1.default(new textview_1.Text("\u5F00\u59CB\u6E38\u620F"));
          startBtn.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          this.options.addView(startBtn);
          startBtn.textSize = 24;
          startBtn.onclickInternal = ((event) => {
            this.gameSelectPopup.show();
            return true;
          }).bind(this);
          let configBtn = new textview_1.default(new textview_1.Text("\u914D\u7F6E"));
          configBtn.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          this.options.addView(configBtn);
          configBtn.textSize = 24;
          configBtn.margin.top = 60;
          let configPanel = new ConfigPanel();
          configPanel.visible = false;
          this.mainPanel.addView(configPanel);
          configBtn.onclickInternal = (event) => {
            configPanel.show();
            return true;
          };
          this.gameSelectPopup = new GameSelectPopup();
          this.mainPanel.addView(this.gameSelectPopup);
        }
        onStart(ctx) {
          let that = this;
          this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, layout_1.Specify.NONE);
          this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
          let animatorTextViewString = new number_linear_animator_1.default(0, this.title.text.content.length, 1500);
          animatorTextViewString.onValChange = function(val) {
            that.title.showTextLength = val;
          };
          animatorTextViewString.onStop = function() {
            setTimeout(() => {
              that.options.visible = true;
            }, 500);
          };
          this.animators.push(animatorTextViewString);
        }
        update(dt) {
          this.animators.forEach((animator) => {
            animator.update(dt);
          });
        }
        render(ctx) {
          this.mainPanel.drawToCanvas(ctx);
        }
        onclick(event) {
          this.mainPanel.onclick(event);
        }
        onpress(event) {
          this.mainPanel.onpress(event);
        }
        ondrag(event) {
          this.mainPanel.ondrag(event);
        }
      };
      exports.default = WelcomeScene;
      var GameSelectPopup = class extends linear_layout_1.default {
        constructor() {
          super();
          this.visible = false;
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.margin.left = this.margin.right = 40;
          this.setPadding(20);
          this.layoutParam.xcfg = layout_1.Align.CENTER;
          this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.bgColor = "#f6f6f6";
        }
        show() {
          let that = this;
          that.removeAllViews();
          let infos = db_manager_1.default.getInstance().getSaveInfos();
          infos.forEach((info) => {
            let view = new SaveItemView(info);
            let cacheInfo = info;
            view.onclickInternal = () => {
              that.visible = false;
              console.log("use " + cacheInfo.dbName);
              db_manager_1.default.getInstance().use(cacheInfo.dbName);
              if (string_utils_1.StringUtils.isEmpty(game_state_1.GameState.instance.currentSceneName)) {
                game_state_1.GameState.instance.currentSceneName = "act1";
              }
              scene_manager_1.default.getInstance().switchScene(game_state_1.GameState.instance.currentSceneName);
              return true;
            };
            this.addView(view);
          });
          that.setIsDirty(true);
          this.visible = true;
        }
        onTouchOutside(event) {
          if (this.visible) {
            this.visible = false;
            return true;
          }
          return super.onTouchOutside(event);
        }
      };
      var ConfigPanel = class extends linear_layout_1.default {
        constructor() {
          super();
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.margin.left = this.margin.right = 40;
          this.padding.left = this.padding.right = this.padding.bottom = this.padding.top = 20;
          this.layoutParam.xcfg = layout_1.Align.CENTER;
          this.layoutParam.ycfg = layout_1.Align.CENTER;
          this.bgColor = colors_1.default.winGrey;
        }
        show() {
          let that = this;
          this.removeAllViews();
          let clearBtn = new textview_1.default(new textview_1.Text("\u6E05\u9664\u5B58\u6863:"));
          clearBtn.textColor = colors_1.default.black;
          clearBtn.margin.bottom = 10;
          this.addView(clearBtn);
          let infos = db_manager_1.default.getInstance().getSaveInfos();
          infos.forEach((info) => {
            let view = new SaveItemView(info);
            let cacheInfo = info;
            view.onclickInternal = () => {
              db_manager_1.default.getInstance().clearAllSave(cacheInfo.dbName);
              that.show();
              return true;
            };
            this.addView(view);
          });
          this.setIsDirty(true);
          this.visible = true;
        }
        onTouchOutside(event) {
          if (this.visible) {
            this.visible = false;
            return true;
          }
          return super.onTouchOutside(event);
        }
      };
      var SaveItemView = class extends linear_layout_1.default {
        constructor(info) {
          super(linear_layout_1.Orientation.VERTICAL);
          this.padding.top = this.padding.bottom = this.padding.left = this.padding.right = 40;
          this.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.border = new sprite_1.Border();
          this.border.color = colors_1.default.black;
          let title = new textview_1.default(new textview_1.Text(info.name));
          let date = new textview_1.default(new textview_1.Text(info.date));
          title.textColor = colors_1.default.black;
          date.textColor = colors_1.default.black;
          date.layoutParam.xcfg = layout_1.Align.END;
          this.addView(title);
          this.addView(date);
        }
      };
    }
  });

  // js/misc/time.js
  var require_time = __commonJS({
    "js/misc/time.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.timestamp = void 0;
      function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
      }
      exports.timestamp = timestamp;
    }
  });

  // js/game/hello_world_scene.js
  var require_hello_world_scene = __commonJS({
    "js/game/hello_world_scene.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var layout_1 = require_layout();
      var number_linear_animator_1 = require_number_linear_animator();
      var imageview_1 = require_imageview();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var dialogue_view_1 = require_dialogue_view();
      var dialogue_1 = require_dialogue();
      var option_view_1 = require_option_view();
      var richtext_1 = require_richtext();
      var birdview_image_1 = require_birdview_image();
      var animator_set_1 = require_animator_set();
      var scrollview_1 = require_scrollview();
      var character_1 = require_character();
      var HelloWorldScene = class {
        constructor(canvas2) {
          this.canvasWidth = canvas2.width;
          this.canvasHeight = canvas2.height;
          this.mainPanel = new panel_1.default();
          this.mainPanel.forceWidth = canvas2.width;
          this.mainPanel.forceHeight = canvas2.height;
          this.mainPanel.padding.left = 20;
          this.mainPanel.padding.right = 20;
          this.mainPanel.padding.bottom = 20;
          this.animators = new Array();
          let birdview = new birdview_image_1.default("res/city_of_yan.png");
          birdview.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          birdview.layoutParam.yLayout = layout_1.LayoutType.MATCH_PARENT;
          this.mainPanel.addView(birdview);
          let scanningImage1 = new number_linear_animator_1.default(0, 200, 4e3);
          let scanningImage2 = new number_linear_animator_1.default(0, 100, 4e3);
          scanningImage1.onValChange = (val) => {
            birdview.sx = val;
          };
          scanningImage2.onValChange = (val) => {
            birdview.sy = val;
          };
          let scanningImage3 = scanningImage1.reverse();
          let scanningImage4 = scanningImage2.reverse();
          scanningImage3.onValChange = scanningImage1.onValChange;
          scanningImage4.onValChange = scanningImage2.onValChange;
          let scanningImage = new animator_set_1.AnimatorSetBuilder().after(scanningImage1).after(scanningImage2).after(scanningImage3).after(scanningImage4).build();
          this.animators.push(scanningImage);
          let scrollView = new scrollview_1.ScrollView();
          scrollView.forceHeight = 200;
          this.mainPanel.addView(scrollView);
          let text = new textview_1.default(new textview_1.Text("\u4F60\u597D\uFF0C\u8FC7\u53BB(\u4E0D\u5BF9\u9F50)"));
          text.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          text.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          scrollView.addView(text);
          text.bgColor = "#cccccc";
          let text2 = new textview_1.default(new textview_1.Text("\u4F60\u597D\uFF0C\u8FC7\u53BB(\u5BF9\u9F50)"));
          text2.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          text2.margin.top = 40;
          scrollView.addView(text2);
          text2.bgColor = "#eeeeee";
          let text3 = new textview_1.default(new textview_1.Text("\u8FD9\u53E5\u5B50\u6709\u56DB\u4E2A\f\u8D85\u7EA7\u80FD\u529B\r \f+1\r\u3002").updatePatternDrawFunc("\u8D85\u7EA7\u80FD\u529B", new richtext_1.BgText("green", "white", layout_1.Align.END)).updatePatternDrawFunc("+1", new richtext_1.BgText(void 0, "white", layout_1.Align.START)));
          text3.layoutParam = new layout_1.LayoutParams(layout_1.Align.CENTER, layout_1.Align.CENTER);
          text3.margin.top = -100;
          scrollView.addView(text3);
          text3.bgColor = "#bbbbbb";
          let imageView = new imageview_1.default("res/artichoke_PNG30.png");
          imageView.margin.left = canvas2.width / 3;
          imageView.forceWidth = imageView.forceHeight = 100;
          this.mainPanel.addView(imageView);
          let animatorImageViewY = new number_linear_animator_1.default(0, canvas2.height * 2, 2e4);
          animatorImageViewY.onValChange = function(val) {
            imageView.y = animatorImageViewY.getVal();
          };
          this.animators.push(animatorImageViewY);
          let longText = new textview_1.default(new textview_1.Text("\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u957F\uFF0C\u975E\u5E38\u957F\u7684\u53E5\u5B50\u3002\u6211\u5E0C\u671B\u4F60\u80FD\u591F\u5E2E\u5FD9\u6362\u4E00\u4E0B\u884C,thank you very much."));
          longText.layoutParam = new layout_1.LayoutParams(layout_1.Align.START, layout_1.Align.CENTER);
          longText.margin.top = 100;
          longText.debug = true;
          longText.padding.top = longText.padding.bottom = longText.padding.left = longText.padding.right = 16;
          scrollView.addView(longText);
          let up = new textview_1.default(new textview_1.Text("Up"));
          let down = new textview_1.default(new textview_1.Text("Down"));
          up.onclickInternal = (event) => {
            scrollView.scrollBy(0, -10);
            return true;
          };
          up.onpressInternal = up.onclickInternal;
          down.onclickInternal = (event) => {
            scrollView.scrollBy(0, 10);
            return true;
          };
          down.onpressInternal = down.onclickInternal;
          up.layoutParam.xcfg = layout_1.Align.START;
          up.layoutParam.ycfg = layout_1.Align.CENTER;
          down.layoutParam.xcfg = layout_1.Align.END;
          down.layoutParam.ycfg = layout_1.Align.CENTER;
          this.mainPanel.addView(up);
          this.mainPanel.addView(down);
          this.dialogueView = new dialogue_view_1.default();
          this.dialogueView.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.dialogueView.forceHeight = canvas2.height / 4;
          this.mainPanel.addView(this.dialogueView);
          this.dialogueView.bgColor = "#FFF99D";
          let me = new character_1.Character();
          me.name = "\u90D1\u867E\u7C73";
          me.imageSrc = "res/copyleft/people_fanwuji.png";
          this.me = me;
          let her = new character_1.Character();
          her.name = "\u848B\u5C0F\u52A0";
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u8FD9\u662F\u4E00\u6BB5\u5F88\u957F\u7684\u8BDD\uFF0C\u4F46\u662F\u5982\u679C\u4F60\u60F3\u770B\u5B8C\uFF0COk, Fine. \u6211\u4E5F\u6CA1\u6709\u4EFB\u4F55\u610F\u89C1\uFF0C\u53EA\u662F\u89C9\u5F97\u4F60\u6216\u8BB8\u53EF\u4EE5\u505A\u4E00\u70B9\u66F4\u6709\u610F\u4E49\u7684\u4E8B\u60C5")));
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u4E0D\u8981\u8BB2\u5E72\u8BDD")));
          this.dialogueView.onDialogueFinished = (() => {
            this.showSimpleOptions();
          }).bind(this);
          this.optionView = new option_view_1.default(canvas2);
          this.mainPanel.addView(this.optionView);
        }
        onStart(ctx) {
          this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, layout_1.Specify.X | layout_1.Specify.Y);
          this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
        }
        showSimpleOptions() {
          let that = this;
          let options = new Array();
          let OPT;
          (function(OPT2) {
            OPT2[OPT2["DENY"] = 0] = "DENY";
            OPT2[OPT2["ACCEPT"] = 1] = "ACCEPT";
            OPT2[OPT2["FIGHT"] = 2] = "FIGHT";
          })(OPT || (OPT = {}));
          let optDeny = new option_view_1.Option(OPT.DENY, new textview_1.Text("\u54C8\u54C8 \u6211\u8F88\u5C82\u662F\u84EC\u84BF\u4EBA \f\u6B63\u6C14\r\f+1\r").updatePatternDrawFunc("\u6B63\u6C14", new richtext_1.BgText("green", "white")).updatePatternDrawFunc("+1", new richtext_1.BgText(void 0, "white")));
          let optAccept = new option_view_1.Option(OPT.ACCEPT, new textview_1.Text("\u54CE\u5440 \u4FEF\u9996\u7518\u4E3A\u5B7A\u5B50\u725B \f\u91D1\u94B1\r\f+500\r").updatePatternDrawFunc("\u91D1\u94B1", new richtext_1.BgText("yellow", "black")).updatePatternDrawFunc("+500", new richtext_1.BgText(void 0, "white")));
          let optFight = new option_view_1.Option(OPT.FIGHT, new textview_1.Text("\u4F60\u6562\u7F9E\u8FB1\u6211\uFF0C\u6253\u4F60\u4E00\u987F. \f\u6B66\u529B\r\f+1\r \f\u66B4\u8E81\r\f+1\r").updatePatternDrawFunc("\u6B66\u529B", new richtext_1.BgText("green", "white")).updatePatternDrawFunc("\u66B4\u8E81", new richtext_1.BgText("black", "white")).updatePatternDrawFunc("+1", new richtext_1.BgText(void 0, "white")));
          options.push(optDeny, optAccept, optFight);
          let callback = {
            onOptionClicked(option) {
              switch (option) {
                case OPT.ACCEPT:
                  that.dialogueView.addDialogue(new dialogue_1.default(that.me, new textview_1.Text("\u8C22\u8C22\uFF0C\u597D\u554A\u597D\u554A\u597D\u554A")));
                  that.dialogueView.addDialogue(new dialogue_1.default(that.her, new textview_1.Text("\u54C8\u54C8\u54C8\u54C8\u54C8"), false));
                  break;
                case OPT.DENY:
                  that.dialogueView.addDialogue(new dialogue_1.default(that.me, new textview_1.Text("\u8C22\u8C22\uFF0C\u6211\u4E0D\u80FD\u63A5\u53D7")));
                  that.dialogueView.addDialogue(new dialogue_1.default(that.her, new textview_1.Text("\u6211\u8BEF\u4F1A\u4F60\u4E86"), false));
                  break;
                case OPT.FIGHT:
                  that.dialogueView.addDialogue(new dialogue_1.default(that.me, new textview_1.Text("\u4F60\u4E0D\u80FD\u4FAE\u8FB1\u6211\u7684\u4EBA\u683C\uFF0C\u6211\u8981\u8DDF\u4F60\u51B3\u6597")));
                  that.dialogueView.addDialogue(new dialogue_1.default(that.her, new textview_1.Text("\u554A\u554A\u554A\u554A"), false));
                  break;
              }
              that.dialogueView.onDialogueFinished = () => {
                that.dialogueView.visible = false;
              };
              return true;
            }
          };
          let title = "\u63A5\u53D7\u8D3F\u8D42\u5417\uFF1F";
          this.optionView.show(new textview_1.Text(title), options, callback);
        }
        update(dt) {
          this.animators.forEach((animator) => {
            animator.update(dt);
          });
          this.dialogueView.updateTime(dt);
        }
        render(ctx) {
          this.mainPanel.drawToCanvas(ctx);
        }
        onclick(event) {
          this.mainPanel.onclick(event);
        }
        onpress(event) {
          this.mainPanel.onpress(event);
        }
        ondrag(event) {
          this.mainPanel.ondrag(event);
        }
      };
      exports.default = HelloWorldScene;
    }
  });

  // js/game/scene1.js
  var require_scene1 = __commonJS({
    "js/game/scene1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var character_1 = require_character();
      var dialogue_1 = require_dialogue();
      var layout_1 = require_layout();
      var dialogue_view_1 = require_dialogue_view();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var Scene1 = class {
        constructor(canvas2) {
          this.canvasWidth = canvas2.width;
          this.canvasHeight = canvas2.height;
          this.mainPanel = new panel_1.default();
          this.mainPanel.forceWidth = canvas2.width;
          this.mainPanel.forceHeight = canvas2.height;
          this.mainPanel.padding.left = 20;
          this.mainPanel.padding.right = 20;
          this.mainPanel.padding.bottom = 20;
          this.dialogueView = new dialogue_view_1.default();
          this.dialogueView.forceWidth = canvas2.width;
          this.dialogueView.forceHeight = canvas2.height / 4;
          this.mainPanel.addView(this.dialogueView);
        }
        onStart(ctx) {
          let me = new character_1.Character();
          me.name = "\u8346\u68D8";
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u6211\u53D4\u7236\u662F\u8346\u8F72\uFF0C\u8346\u68D8\u662F\u6211\u7684\u540D\u5B57\u3002")));
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u53D4\u7236\u88AB\u4EBA\u6740\u4E86\uFF0C")));
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u800C\u6211\u5374\u6CA1\u6709\u66FF\u4ED6\u62A5\u4EC7..")));
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u8FD9\u91CC\u9762\u7684\u7EA0\u7F20\u5728\u6211\u8111\u4E2D\u6325\u4E4B\u4E0D\u53BB\uFF0C\u8BF7\u4F60\u8010\u5FC3\u542C\u6211\u503E\u8BC9")));
          this.dialogueView.addDialogue(new dialogue_1.default(me, new textview_1.Text("\u90A3\u5E74\u6211 16 \u5C81\uFF0C\u800C\u53D4\u7236\u8FD8\u5728\u71D5\u90FD\u592A\u5B50\u505A\u95E8\u5BA2\uFF0C\u6211\u53BB\u6295\u5954\u53D4\u7236....")));
          this.mainPanel.measure(ctx, this.canvasWidth, this.canvasHeight, layout_1.Specify.NONE);
          this.mainPanel.layout(this.canvasWidth, this.canvasHeight);
        }
        update(dt) {
          this.dialogueView.updateTime(dt);
        }
        render(ctx) {
          this.mainPanel.drawToCanvas(ctx);
        }
        onclick(event) {
          this.mainPanel.onclick(event);
        }
        onpress(event) {
          this.mainPanel.onpress(event);
        }
        ondrag(event) {
          this.mainPanel.ondrag(event);
        }
      };
      exports.default = Scene1;
    }
  });

  // js/misc/event_handler.js
  var require_event_handler = __commonJS({
    "js/misc/event_handler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var event_1 = require_event();
      var EventHandler = class {
        constructor() {
          this.onclickHandler = void 0;
          this.onpressHandler = void 0;
          this.startTime = 0;
        }
        bind(widget) {
          let that = this;
          document.addEventListener("touchstart", function(ev) {
            that.onpointerdown(Math.round(ev.touches[0].pageX), Math.round(ev.touches[0].pageY));
          });
          document.addEventListener("touchmove", function(ev) {
            that.onpointermove(Math.round(ev.touches[0].pageX), Math.round(ev.touches[0].pageY));
          });
          document.addEventListener("touchend", function(ev) {
            that.onpointerup(that.movingX, that.movingY);
            ev.preventDefault();
          });
          document.addEventListener("mousedown", function(ev) {
            that.onpointerdown(Math.round(ev.pageX), Math.round(ev.pageY));
          });
          document.addEventListener("mousemove", function(ev) {
            that.onpointermove(Math.round(ev.pageX), Math.round(ev.pageY));
          });
          document.addEventListener("mouseup", function(ev) {
            that.onpointerup(Math.round(ev.pageX), Math.round(ev.pageY));
          });
        }
        bindOnClickHandler(fn) {
          this.onclickHandler = fn;
        }
        bindOnPressHandler(fn) {
          this.onpressHandler = fn;
        }
        bindOnDragHandler(fn) {
          this.ondragHandler = fn;
        }
        onpointerdown(x, y) {
          this.stopTimeout();
          this.startTime = new Date().getTime();
          this.pointDownX = x;
          this.pointDownY = y;
          this.movingX = x;
          this.movingY = y;
          this.timeoutId = window.setTimeout((() => {
            let fn = () => {
              let overlap = new Date().getTime() - this.startTime;
              this.sendPressEvent(x, y, overlap);
            };
            this.intervalId = window.setInterval(() => {
              fn();
            }, EventHandler.CONTINUE_PRESS_TIME);
            fn();
          }).bind(this), EventHandler.LONGPRESS_TIME);
        }
        onpointerup(x, y) {
          this.stopTimeout();
          if (EventHandler.positionChanged(x, y, this.pointDownX, this.pointDownY)) {
            return;
          }
          let overlap = new Date().getTime() - this.startTime;
          if (overlap >= EventHandler.LONGPRESS_TIME) {
            this.sendPressEvent(x, y, overlap);
          } else {
            this.sendClickEvent(x, y);
          }
        }
        onpointermove(x, y) {
          this.movingX = x;
          this.movingY = y;
          if (EventHandler.positionChanged(x, y, this.pointDownX, this.pointDownY)) {
            this.stopTimeout();
          }
          let dragX = x - this.pointDownX;
          let dragY = y - this.pointDownY;
          this.sendDragEvent(this.pointDownX, this.pointDownY, dragX, dragY, this.startTime);
        }
        stopTimeout() {
          if (this.timeoutId > 0) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = -1;
          }
          if (this.intervalId > 0) {
            window.clearInterval(this.intervalId);
            this.intervalId = -1;
          }
        }
        sendClickEvent(x, y) {
          if (this.onclickHandler) {
            this.onclickHandler(new event_1.ClickEvent(Math.floor(x), Math.floor(y)));
          }
        }
        sendPressEvent(x, y, time) {
          if (this.onpressHandler) {
            this.onpressHandler(new event_1.PressEvent(Math.floor(x), Math.floor(y)));
          }
        }
        sendDragEvent(startX, startY, dragX, dragY, startTime) {
          if (this.ondragHandler) {
            this.ondragHandler(new event_1.DragEvent(startX, startY, dragX, dragY, startTime));
          }
        }
        static positionChanged(x1, y1, x2, y2) {
          let error = 10;
          return Math.abs(x1 - x2) >= error || Math.abs(y1 - y2) >= error;
        }
      };
      exports.default = EventHandler;
      EventHandler.LONGPRESS_TIME = 500;
      EventHandler.CONTINUE_PRESS_TIME = 50;
    }
  });

  // js/debug/debug_log.js
  var require_debug_log = __commonJS({
    "js/debug/debug_log.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LogModel = void 0;
      var bindable_data_1 = require_bindable_data();
      var LogModel = class extends bindable_data_1.BindableData {
        constructor() {
          super();
          this.content = [];
        }
        pushText(t) {
          this.content.push(t);
          if (this.content.length > 10) {
            this.content = this.content.slice(1);
          }
          this.dirty = true;
        }
        getText() {
          let totalText = "";
          this.content.forEach((t) => {
            totalText += t + "\n";
          });
          return totalText;
        }
      };
      exports.LogModel = LogModel;
      LogModel.instance = new LogModel();
      var DebugLog = class {
        static d(text) {
          LogModel.instance.pushText(text);
        }
      };
      exports.default = DebugLog;
    }
  });

  // js/debug/debug_view.js
  var require_debug_view = __commonJS({
    "js/debug/debug_view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var colors_1 = require_colors();
      var layout_1 = require_layout();
      var panel_1 = require_panel();
      var textview_1 = require_textview();
      var debug_log_1 = require_debug_log();
      var DebugView = class extends panel_1.default {
        constructor() {
          super();
          this.text = new textview_1.default(new textview_1.Text(""));
          this.text.textSize = 16;
          this.text.textColor = colors_1.default.white;
          this.text.layoutParam.xLayout = layout_1.LayoutType.MATCH_PARENT;
          this.text.layoutParam.yLayout = layout_1.LayoutType.MATCH_PARENT;
          this.addView(this.text);
          this.bindData(debug_log_1.LogModel.instance, DebugView.update);
        }
        static update(v, m) {
          v.text.setText(new textview_1.Text(m.getText()));
          v.setIsDirty(true);
        }
      };
      exports.default = DebugView;
      DebugView.instance = new DebugView();
    }
  });

  // js/game/data/goods/quest_goods_infos.js
  var require_quest_goods_infos = __commonJS({
    "js/game/data/goods/quest_goods_infos.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var goods_1 = require_goods();
      var QuestGoodsInfos = class {
        static init() {
          let YanWine = new goods_1.GoodsInfo();
          YanWine.name = "\u71D5\u6D4A\u9152";
          YanWine.cost = 10;
          YanWine.functional_text = "\u6D4A\u9152\u5165\u80A0\uFF0C\u9189\u800C\u5FD8\u4E61";
          YanWine.image = "res/created/medition.png";
          this.YanWine = YanWine;
        }
      };
      exports.default = QuestGoodsInfos;
    }
  });

  // js/main.js
  var require_main = __commonJS({
    "js/main.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var act1_1 = require_act1();
      var welcome_scene_1 = require_welcome_scene();
      var scene_manager_1 = require_scene_manager();
      var time_1 = require_time();
      var hello_world_scene_1 = require_hello_world_scene();
      var scene1_1 = require_scene1();
      var player_1 = require_player();
      var event_handler_1 = require_event_handler();
      var db_manager_1 = require_db_manager();
      var game_state_1 = require_game_state();
      var text_effects_1 = require_text_effects();
      var parcel_1 = require_parcel();
      var debug_view_1 = require_debug_view();
      var layout_1 = require_layout();
      var simple_goods_infos_1 = require_simple_goods_infos();
      var quest_goods_infos_1 = require_quest_goods_infos();
      var yan_bm_1 = require_yan_bm();
      var Main2 = class {
        constructor(canvas2) {
          this.canvas = canvas2;
          this.aniId = 0;
          this.bindLoop = this.gameLoop.bind(this);
          this.ctx = canvas2.getContext("2d");
          this.ctx.textBaseline = "top";
          this.last = (0, time_1.timestamp)();
          scene_manager_1.default.init(this.ctx);
          text_effects_1.default.init();
          simple_goods_infos_1.default.init();
          quest_goods_infos_1.default.init();
          yan_bm_1.YanBm.init();
          let welcomeScene = new welcome_scene_1.default(canvas2);
          scene_manager_1.default.getInstance().push("welcome", welcomeScene);
          let helloWorldScene = new hello_world_scene_1.default(canvas2);
          scene_manager_1.default.getInstance().push("helloworld", helloWorldScene);
          let scene1 = new scene1_1.default(canvas2);
          scene_manager_1.default.getInstance().push("scene1", scene1);
          let act1 = new act1_1.default(canvas2);
          scene_manager_1.default.getInstance().push("act1", act1);
          scene_manager_1.default.getInstance().switchScene("welcome");
          window.cancelAnimationFrame(this.aniId);
          this.aniId = window.requestAnimationFrame(this.bindLoop);
          this.eventHandler = new event_handler_1.default();
          this.eventHandler.bind(canvas2);
          this.eventHandler.bindOnClickHandler((event) => {
            return scene_manager_1.default.getInstance().currentScene.onclick(event);
          });
          this.eventHandler.bindOnPressHandler((event) => {
            return scene_manager_1.default.getInstance().currentScene.onpress(event);
          });
          this.eventHandler.bindOnDragHandler((event) => {
            return scene_manager_1.default.getInstance().currentScene.ondrag(event);
          });
          db_manager_1.default.getInstance().setReloadFn((db) => {
            let gameStateP = db.getData("game_state");
            if (!gameStateP.isEmpty()) {
              game_state_1.GameState.instance.fromParcel(gameStateP);
            }
            let playerP = db.getData("player");
            if (!playerP.isEmpty()) {
              player_1.Player.instance.fromParcel(playerP);
            }
            let yanBmP = db.getData("YanBm");
            if (!yanBmP.isEmpty()) {
              yan_bm_1.YanBm.instance.fromParcel(yanBmP);
            }
          });
          db_manager_1.default.getInstance().setSaveFn((db) => {
            let p = new parcel_1.default();
            game_state_1.GameState.instance.toParcel(p);
            db.saveData("game_state", p);
            p = new parcel_1.default();
            player_1.Player.getInstance().toParcel(p);
            db.saveData("player", p);
            p = new parcel_1.default();
            yan_bm_1.YanBm.instance.toParcel(p);
            db.saveData("YanBm", p);
          });
          debug_view_1.default.instance.measure(this.ctx, canvas2.width, canvas2.height, layout_1.Specify.NONE);
          debug_view_1.default.instance.layout(canvas2.width, canvas2.height, 20, 50);
        }
        gameLoop() {
          let now = (0, time_1.timestamp)();
          let dt = now - this.last;
          this.update(dt);
          this.render();
          this.last = now;
          this.aniId = window.requestAnimationFrame(this.bindLoop);
        }
        update(dt) {
          scene_manager_1.default.getInstance().currentScene.update(dt);
        }
        render() {
          this.clearScreen();
          scene_manager_1.default.getInstance().currentScene.render(this.ctx);
          debug_view_1.default.instance.drawToCanvas(this.ctx);
        }
        clearScreen() {
          this.ctx.save();
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
          this.ctx.restore();
        }
      };
      exports.default = Main2;
    }
  });

  // game.js
  var import_main = __toModule(require_main());
  "use strict";
  var canvas = document.getElementById("canvas");
  new import_main.default(canvas);
})();
