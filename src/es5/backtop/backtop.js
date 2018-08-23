// 文章： 从几个常见属性讲起（offset scrollTop client）
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BackTop = factory();
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

  // 获取滚动条距顶部的距离
  function getScrollTop() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  // 设置滚动条距顶部的距离
  function setScrollTop(value) {
    window.scrollTo(0, value);
    return value;
  }

  /**
   *
   * @desc  在${duration}时间内，滚动条平滑滚动到${to}指定位置
   * @param {Number} to
   * @param {Number} duration
   */
  function scrollTo(to, duration) {
    if (duration < 0) {
      setScrollTop(to);
      return;
    }
    var diff = to - getScrollTop();
    if (diff === 0) return;
    var step = (diff / duration) * 10;
    requestAnimationFrame(function() {
      if (Math.abs(step) > Math.abs(diff)) {
        setScrollTop(getScrollTop() + diff);
        return;
      }
      setScrollTop(getScrollTop() + step);
      if (
        (diff > 0 && getScrollTop() >= to) ||
        (diff < 0 && getScrollTop() <= to)
      ) {
        return;
      }
      scrollTo(to, duration - 16);
    });
  }

  var BackTop = function(selector, userOptions) {
    // 合并配置
    extend(this.backTopOptions, userOptions, true);
    // 初始化
    this.initBackTop();
    this.bindBackTop();
  };
  BackTop.prototype = {
    backTopOptions: {
      elem: document.body
    },
    initBackTop: function() {
      this.timer = null;
      this.isTop = true;
      this.isShowScroll = false;
      this.initScroll();
    },
    bindBackTop: function() {
      var _this = this;
      addEvent(document.querySelector("#backTop"), "click", function(e) {
        _this.timer = setInterval(function() {
          var osTop = _this.backTopOptions.elem.scrollTop;
          var ispeed = Math.floor(-osTop / 5);
          _this.backTopOptions.elem.scrollTop = osTop + ispeed;
          _this.isTop = true;
          if (osTop === 0) {
            clearInterval(_this.timer);
          }
        }, 30);
      });
    },
    initScroll: function() {
      var clientHeight = this.backTopOptions.elem.clientHeight;
      var _this = this;
      addEvent(document, "scroll", function(e) {
        var osTop = _this.backTopOptions.elem.scrollTop;
        if (osTop >= clientHeight) {
          _this.isShowScroll = true;
        } else {
          _this.isShowScroll = false;
        }
        if (!_this.isTop) {
          clearInterval(_this.timer);
        }
        _this.isTop = false;
      });
    },
    constructor: BackTop
  };

  return BackTop;
});
