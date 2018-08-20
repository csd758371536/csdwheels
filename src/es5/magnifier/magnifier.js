(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Magnifier = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // Polyfills
  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  }

  // 合并对象
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  var Magnifier = function(selector, userOptions) {
    // 合并配置
    extend(this.magnifierOptions, userOptions, true);
    // 初始化
    this.initMagnifier(selector);
    // 绑定事件
    this.bindMagnifier();
  };
  Magnifier.prototype = {
    magnifierOptions: {},
    initMagnifier: function(selector) {
      this.magnifier = document.querySelector(selector);
      this.magnifierSmall = this.magnifier.children[0];
      this.magnifierSmallMask = this.magnifierSmall.children[1];
      this.magnifierBig = this.magnifier.children[1];
      this.magnifierBigImg = this.magnifierBig.children[0];
      this.magnifierSmallMaskLeft = 0;
      this.magnifierSmallMaskTop = 0;
    },
    bindMagnifier: function() {
      var _this = this;
      addEvent(this.magnifierSmall, "mouseover", function(e) {
        _this.setElemDisplay(_this.magnifierSmallMask, "block");
        _this.setElemDisplay(_this.magnifierBig, "block");
      });
      addEvent(this.magnifierSmall, "mouseout", function(e) {
        _this.setElemDisplay(_this.magnifierSmallMask, "none");
        _this.setElemDisplay(_this.magnifierBig, "none");
      });
      addEvent(this.magnifierSmall, "mousemove", function(e) {
        _this.getMaskPosition(e);
        _this.setMaskPosition();
        _this.setImgPosition();
      });
    },
    setElemDisplay: function(elem, type) {
      elem.style.display = type;
    },
    setElemLeft: function(elem, left) {
      elem.style.left = left + "px";
    },
    setElemTop: function(elem, top) {
      elem.style.top = top + "px";
    },
    getMaskPosition: function(event) {
      var event = event || window.event;
      this.magnifierSmallMaskLeft =
        event.clientX -
        this.magnifier.offsetLeft -
        this.magnifierSmallMask.offsetWidth / 2;
      this.magnifierSmallMaskTop =
        event.clientY -
        this.magnifier.offsetTop -
        this.magnifierSmallMask.offsetHeight / 2;
      if (this.magnifierSmallMaskLeft < 0) {
        this.magnifierSmallMaskLeft = 0;
      }
      if (
        this.magnifierSmallMaskLeft >
        this.magnifierSmall.offsetWidth - this.magnifierSmallMask.offsetWidth
      ) {
        this.magnifierSmallMaskLeft =
          this.magnifierSmall.offsetWidth - this.magnifierSmallMask.offsetWidth;
      }
      if (this.magnifierSmallMaskTop < 0) {
        this.magnifierSmallMaskTop = 0;
      }
      if (
        this.magnifierSmallMaskTop >
        this.magnifierSmall.offsetHeight - this.magnifierSmallMask.offsetHeight
      ) {
        this.magnifierSmallMaskTop =
          this.magnifierSmall.offsetHeight -
          this.magnifierSmallMask.offsetHeight;
      }
    },
    setMaskPosition: function() {
      this.setElemLeft(this.magnifierSmallMask, this.magnifierSmallMaskLeft);
      this.setElemTop(this.magnifierSmallMask, this.magnifierSmallMaskTop);
    },
    setImgPosition: function() {
      this.setElemLeft(
        this.magnifierBigImg,
        (-this.magnifierSmallMaskLeft * this.magnifierBig.offsetWidth) /
          this.magnifierSmall.offsetWidth
      );
      this.setElemTop(
        this.magnifierBigImg,
        (-this.magnifierSmallMaskTop * this.magnifierBig.offsetHeight) /
          this.magnifierSmall.offsetHeight
      );
    },
    constructor: Magnifier
  };

  return Magnifier;
});
