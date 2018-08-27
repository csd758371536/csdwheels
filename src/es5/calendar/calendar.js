(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Calendar = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // 基于MVVM思想来实现，参考收藏的文章

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

  var Calendar = function(selector, userOptions) {
    // 合并配置
    extend(this.calendarOptions, userOptions, true);
    // 初始化
    this.initCalendar(selector);
    // 绑定事件
    this.bindCalendar();
  };
  Calendar.prototype = {
    calendarOptions: {},
    initCalendar: function(selector) {
      this.calendar = document.querySelector(selector);
    },
    bindCalendar: function() {},
    constructor: Calendar
  };

  return Calendar;
});
