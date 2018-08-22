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
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop
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
      this.setScrollTop(to);
      return;
    }
    var diff = to - this.getScrollTop();
    if (diff === 0) return;
    var step = (diff / duration) * 10;
    requestAnimationFrame(function() {
      if (Math.abs(step) > Math.abs(diff)) {
        this.setScrollTop(this.getScrollTop() + diff);
        return;
      }
      this.setScrollTop(this.getScrollTop() + step);
      if (
        (diff > 0 && this.getScrollTop() >= to) ||
        (diff < 0 && this.getScrollTop() <= to)
      ) {
        return;
      }
      scrollTo(to, duration - 16);
    });
  }

  var BackTop = function(selector, userOptions) {};
  BackTop.prototype = {
    backTopOptions: {},
    initBackTop: function() {},
    constructor: BackTop
  };

  return BackTop;
});
