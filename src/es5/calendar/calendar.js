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
      // 获取日历元素
      this.calendar = document.querySelector(selector);
      // 设置日历时间（默认为当前时间）
      this.calendarTime = this.obtainDate(new Date());
      // 要显示的日期数
      // 因为一周有7天，一个月最多有31天，一个月最多能横跨6行，所以至少要7*6=42个格子，其余的格子用前后月份日期补足
      this.weeks = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      this.monthMax = 31;
      this.calendarDaysCount = this.weeks.lenth * (this.monthMax % this.weeks.lenth );// =0 0  =1 +1 >1  +2   >8 +3
      // 保存所有要显示的日期
      this.calendarDays = [];
      // 设置所有要显示的日期
      this.setCalendarDays(new Date("2018-7-21"));
    },
    setCalendarDays: function(date) {
      // 获取当前月第一天是星期几
      var week = this.getFirstDateInMonth(date).getDay();
      // 获取上个月最后一天的日期
      var lastDateInPrevMonth = this.getLastDateInPrevMonth(date).getDate();
      // 判断第一天是否是星期日
      if (week != 0) {
        // 设置上个月显示日期
        this.setCalendarDaysInMonth(
          lastDateInPrevMonth - week + 1,
          lastDateInPrevMonth
        );
      } else {
        // 设置上个月显示日期
        this.setCalendarDaysInMonth(
          lastDateInPrevMonth - 6,
          lastDateInPrevMonth
        );
      }
      // 获取当前月最后一天的日期
      var lastDateInCurrentMonth = this.getLastDateInMonth(date).getDate();
      // 设置当前月份的显示日期
      this.setCalendarDaysInMonth(1, lastDateInCurrentMonth);
      if (this.calendarDays.length != this.calendarDaysCount) {
        // 设置下个月显示日期
        this.setCalendarDaysInMonth(
          1,
          this.calendarDaysCount - this.calendarDays.length
        );
      }
      console.log(this.calendarDays);
    },
    setCalendarDaysInMonth: function(start, end) {
      for (var day = start, len = end; day <= len; day++) {
        this.calendarDays.push(day);
      }
    },
    bindCalendar: function() {},
    /**
     * @description 求当前日期所在月的第一天
     * @param {Date} date 当前日期
     * @return {Date}
     */
    getFirstDateInMonth: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    /**
     * @description 求当前日期上个月的最后一天
     * @param {Date} date 当前日期
     * @return {Date}
     */
    getLastDateInPrevMonth: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), 0);
    },
    /**
     * @description 求当前日期所在月的最后一天
     * @param {Date} date 当前日期
     * @return {Date}
     */
    getLastDateInMonth: function(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    /**
     * @description 求某年某月的天数
     * @param {Number} year 年
     * @param {Number} month 月
     * @return {Number}
     */
    daysInMonth: function(year, month) {
      var d = new Date();
      d.setFullYear(year, month == 12 ? 1 : month, 0);
      return d.getDate();
    },
    /**
     * new Date()格式化为yyyy-MM-dd
     */
    obtainDate: function(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      // 判断是否满10
      var arr = [month, day];
      arr.forEach(function(item) {
        item < 10 ? "0" + item : item;
      });
      return year + "-" + arr[0] + "-" + arr[1];
    },
    constructor: Calendar
  };

  return Calendar;
});
