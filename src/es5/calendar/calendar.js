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
  // 用mvvm重构目前的代码 再加入选择月份和年限的功能
  // 最小和最大年份限制

  // 用发布订阅模式  模板字符串函数  局部刷新 重构

  // var monthMax = 31;
  // var rowMax = 0;
  // if (this.monthMax % this.calendarWeeks.length === 0) {
  //   rowMax = this.monthMax / this.calendarWeeks.length;
  // } else if (this.monthMax % this.calendarWeeks.length === 1) {
  //   rowMax = this.monthMax / this.calendarWeeks.length + 1;
  // } else {
  //   rowMax = this.monthMax / this.calendarWeeks.length + 2;
  // }
  // this.calendarDaysCount = this.calendarWeeks.length * rowMax;

  // new Date(8640000000000000)
  // Sat Sep 13 275760 08:00:00 GMT+0800 (中国标准时间)
  // new Date(-8640000000000000)
  // Tue Apr 20 -271821 08:05:43 GMT+0805 (中国标准时间)
  // new Date('99-5-20')
  // Thu May 20 1999 00:00:00 GMT+0800 (中国标准时间)

  var CLASS = {
    CALENDAR_WRAP: "calendar-wrapper",
    CALENDAR_TITLE: "calendar-title",
    CALENDAR_PREV: "calendar-btn-prev",
    CALENDAR_TIME: "calendar-time",
    CALENDAR_NEXT: "calendar-btn-next",
    CALENDAR_BTN: "calendar-btn",
    CALENDAR_CONTENT: "calendar-content",
    CALENDAR_WEEKS: "calendar-weeks",
    CALENDAR_WEEK: "calendar-week",
    CALENDAR_DAYS: "calendar-days",
    CALENDAR_DAY: "calendar-day",
    CALENDAR_DAY_CURRENT: "calendar-day current",
    CALENDAR_DAY_SELECT: "calendar-day select"
  };

  var ID = {
    CALENDAR_DATE: "calendarDate",
    CALENDAR_DATE_TIME: "calendarDateTime",
    CALENDAR_DATE_PREV: "calendarDatePrev",
    CALENDAR_DATE_NEXT: "calendarDateNext"
  };

  var util = {
    addEvent: function(element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      } else {
        element["on" + type] = handler;
      }
    },
    extend: function(target) {
      for (var i = 1, len = arguments.length; i < len; i++) {
        for (var prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }
      return target;
    },
    isValidListener: function(listener) {
      if (typeof listener === "function") {
        return true;
      } else if (listener && typeof listener === "object") {
        return util.isValidListener(listener.listener);
      } else {
        return false;
      }
    },
    indexOf: function(array, item) {
      if (array.indexOf) {
        return array.indexOf(item);
      } else {
        var result = -1;
        for (var i = 0, len = array.length; i < len; i++) {
          if (array[i] === item) {
            result = i;
            break;
          }
        }
        return result;
      }
    },
    isLastDate: function(year, month) {
      return (
        year === new Date(this.calendarMax).getFullYear() &&
        month === new Date(this.calendarMax).getMonth() + 1
      );
    },
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
    formatDate: function(time, format) {
      function timeFormat(i) {
        i = typeof i == "string" ? parseInt(i) : i;
        return (i < 10 ? "0" : "") + i;
      }
      time = typeof time == "string" ? new Date(time) : time;
      var getFullYear = timeFormat(time.getFullYear()),
        getMonth = timeFormat(time.getMonth() + 1),
        getDate = timeFormat(time.getDate()),
        getDay = timeFormat(time.getDay());
      return {
        getFullYear: parseInt(getFullYear),
        getMonth: parseInt(getMonth),
        getDate: parseInt(getDate),
        getDay: parseInt(getDay),
        date: format.replace(/yyyy|MM|dd/g, function(a) {
          switch (a) {
            case "yyyy":
              return getFullYear;
              break;
            case "MM":
              return getMonth;
              break;
            case "dd":
              return getDate;
              break;
          }
        })
      };
    }
  };

  function EventEmitter() {
    this.__events = {};
  }

  EventEmitter.prototype.on = function(eventName, listener) {
    if (!eventName || !listener) return;

    if (!util.isValidListener(listener)) {
      throw new TypeError("listener must be a function");
    }

    var events = this.__events;
    var listeners = (events[eventName] = events[eventName] || []);
    var listenerIsWrapped = typeof listener === "object";

    // 不重复添加事件
    if (util.indexOf(listeners, listener) === -1) {
      listeners.push(
        listenerIsWrapped
          ? listener
          : {
              listener: listener,
              once: false
            }
      );
    }
    return this;
  };
  EventEmitter.prototype.once = function(eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true
    });
  };
  EventEmitter.prototype.off = function(eventName, listener) {
    var listeners = this.__events[eventName];
    if (!listeners) return;

    var index;
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        index = i;
        break;
      }
    }

    if (typeof index !== "undefined") {
      listeners.splice(index, 1, null);
    }

    return this;
  };
  EventEmitter.prototype.emit = function(eventName, args) {
    var listeners = this.__events[eventName];
    if (!listeners) return;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener) {
        listener.listener.apply(this, args || []);
        if (listener.once) {
          this.off(eventName, listener.listener);
        }
      }
    }
    return this;
  };

  function Calendar(selector, userOptions) {
    // 合并配置
    this.options = util.extend({}, this.constructor.calendarOptions, userOptions, true);
    // 初始化
    this._initCalendar(selector);
    // 日历设置时间（默认为当前时间）
    this.calendarTime = util.formatDate(
      this.options.time,
      "yyyy-MM-dd"
    ).date;
    // 日历显示时间
    this.calendarShowTime = util.formatDate(
      this.options.time,
      "yyyy-MM"
    ).date;
    this._refreshCalendar(new Date(this.options.time));
    // 获取日历元素
    this._getCalendar();
    // 绑定事件
    this._bindCalendar();
    // this.calendarOptions.callback &&
    //   this.calendarOptions.callback(this.calendarTime);
  }

  Calendar.calendarOptions = {};

  var proto = (Calendar.prototype = new EventEmitter());

  proto.constructor = Calendar;

  proto._initCalendar = function(selector) {
    // 获取日历元素
    this.calendar = document.querySelector(selector);
    // 避免出现选中效果
    this.calendar.onselectstart = function() {
      return false;
    };
    // 因为一周有7天，一个月最多有31天，一个月最多能横跨6行，所以至少要7*6=42个格子，其余的格子用前后月份日期补足
    this.calendarWeeks = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    // 每个月最大天数
    this.calendarMaxDay = 31;
    // 最大日期
    this.calendarMax = util.formatDate(
      new Date(8640000000000000),
      "yyyy-MM-dd"
    ).date;
    // 最小日期
    this.calendarMin = "100-01-01";
    // 日历行数
    this.calendarRow =
      Math.floor(this.calendarMaxDay / this.calendarWeeks.length) + 2;
    // 要显示的日期数
    this.calendarDaysCount = this.calendarWeeks.length * this.calendarRow;
  };

  proto._refreshCalendar = function(date) {
    // 设置所有要显示的日期
    this._setCalendarDays(date);
    // 渲染DOM
    this._renderCalendar();
  };

  proto._getCalendar = function() {
    // this.calendarDateElem = document.querySelector("#" + ID.CALENDAR_DATE);
    // this.calendarDateTimeElem = document.querySelector(
    //   "#" + ID.CALENDAR_DATE_TIME
    // );
  };

  proto._setCalendarDays = function(date) {
    // 保存所有要显示的日期
    this.calendarDays = [];
    // 设置上个月显示日期
    this._setCalendarDaysInPrevMonth(date);
    // 设置当前月的显示日期
    this._setCalendarDaysInCurrentMonth(date);
    // 设置下个月显示日期
    this._setCalendarDaysInNextMonth(date);
  };

  proto._setCalendarDaysInPrevMonth = function(date) {
    // 获取当前月第一天是星期几
    var week = util.getFirstDateInMonth(date).getDay();
    // 获取上个月最后一天的日期
    var end = util.getLastDateInPrevMonth(date).getDate();
    // 判断第一天是否是星期日 设置起始日期
    var start =
      week === 0 ? end - this.calendarWeeks.length + 1 : end - week + 1;
    this._setCalendarDaysInMonth(
      date.getMonth() < 1 ? date.getFullYear() - 1 : date.getFullYear(),
      date.getMonth() < 1 ? 12 : date.getMonth(),
      start,
      end,
      false
    );
  };

  proto._setCalendarDaysInCurrentMonth = function(date) {
    // 获取当前月最后一天的日期
    var end;
    // 判断是否是最后一个月的日期
    if (util.isLastDate(date.getFullYear(), date.getMonth() + 1)) {
      end = new Date(this.calendarMax).getDate();
    } else {
      end = util.getLastDateInMonth(date).getDate();
    }
    this._setCalendarDaysInMonth(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
      end,
      true
    );
  };

  proto._setCalendarDaysInNextMonth = function(date) {
    // 判断是否是最后一个月的日期
    if (!util.isLastDate(date.getFullYear(), date.getMonth() + 1)) {
      if (this.calendarDays.length != this.calendarDaysCount) {
        this._setCalendarDaysInMonth(
          date.getMonth() + 2 > 12
            ? date.getFullYear() + 1
            : date.getFullYear(),
          date.getMonth() + 2 > 12 ? 1 : date.getMonth() + 2,
          1,
          this.calendarDaysCount - this.calendarDays.length,
          false
        );
      }
    }
  };

  proto._setCalendarDaysInMonth = function(year, month, start, end, isCurrent) {
    for (var day = start, len = end; day <= len; day++) {
      this.calendarDays.push({
        year: year,
        month: month,
        day: day,
        isCurrent: isCurrent
      });
    }
  };

  proto._renderCalendar = function() {
    var template =
      "{{calendarShowTime}}" +
      '<table class="calendar-content">' +
      "{{calendarWeeks}}" +
      "{{calendarDays}}" +
      "</table>";
    var $wrapper = document.querySelector('.' + CLASS.CALENDAR_WRAP);
    if (!$wrapper) {
      $wrapper = document.createElement('div');
      this.calendar.appendChild($wrapper);
      $wrapper.className = CLASS.CALENDAR_WRAP;
    }
    $wrapper.innerHTML = template
      .replace("{{calendarShowTime}}", this._renderCalendarTitle())
      .replace("{{calendarWeeks}}", this._renderCalendarWeeks())
      .replace("{{calendarDays}}", this._renderCalendarDays());
    // // 第一种模式：显示天数
  };

  proto._renderCalendarTitle = function() {
    return (
      '<div class="calendar-title">' +
      '<a href="javascript:;" class="calendar-btn calendar-btn-prev" id="calendarDatePrev">&lt;</a>' +
      '<span class="calendar-time" id="calendarDateTime">' +
      this.calendarShowTime +
      "</span>" +
      '<a href="javascript:;" class="calendar-btn calendar-btn-next" id="calendarDateNext">&gt;</a>' +
      "</div>"
    );
  };

  proto._renderCalendarWeeks = function() {
    var html = "";
    for (var i = 0; i < this.calendarWeeks.length; i++) {
      html += '<th class="calendar-week">' + this.calendarWeeks[i] + "</th>";
    }
    return '<thead><tr class="calendar-weeks">' + html + "</tr></thead>";
  };

  proto._renderCalendarDays = function() {
    var html = "",
      dom = [],
      calendarDays = [];
    var len = this.calendarWeeks.length;
    for (var i = 0; i < this.calendarRow; i++) {
      html = "";
      html += '<tr class="calendar-days">';
      calendarDays = this.calendarDays.slice(i * len, i * len + len);
      for (var j = 0; j < calendarDays.length; j++) {
        if (calendarDays[j].isCurrent) {
          if (
            util.formatDate(
              new Date(
                calendarDays[j].year,
                calendarDays[j].month - 1,
                calendarDays[j].day
              ),
              "yyyy-MM-dd"
            ).date === this.calendarTime
          ) {
            html +=
              '<td class="calendar-day select" data-date="'+ calendarDays[j].day + '">' +
              calendarDays[j].day +
              "</td>";
          } else {
            html +=
              '<td class="calendar-day current" data-date="' + calendarDays[j].day + '">' +
              calendarDays[j].day +
              "</td>";
          }
        } else {
          html += '<td class="calendar-day" data-date="' + calendarDays[j].day + '">' + calendarDays[j].day + "</td>";
        }
      }
      html += "</tr>";
      dom.push(html);
    }
    return dom.join("");
  };

  proto._bindCalendar = function() {
    this._bindCalendarContent();
    this._bindCalendarBtn();
  };

  proto._bindCalendarContent = function() {
    var _this = this;
    var $wrapper = document.querySelector('.' + CLASS.CALENDAR_WRAP);
    util.addEvent($wrapper, "click", function(ev) {
      var e = ev || window.event;
      var $target = e.target || e.srcElement;
      var $days = document.querySelectorAll("." + CLASS.CALENDAR_DAY);
      if ($target.tagName.toLowerCase() !== 'td') {
        return;
      }
      for (var i = 0; i < $days.length; i++) {
        if ($days[i] === $target) {
          _this.calendarTime = util.formatDate(
            new Date(
              _this.calendarDays[i].year,
              _this.calendarDays[i].month - 1,
              _this.calendarDays[i].day
            ),
            "yyyy-MM-dd"
          ).date;
          _this.calendarShowTime = util.formatDate(
            new Date(
              _this.calendarDays[i].year,
              _this.calendarDays[i].month - 1,
              _this.calendarDays[i].day
            ),
            "yyyy-MM"
          ).date;
          _this._refreshCalendar(new Date(_this.calendarTime));
        }
      }
      _this.emit("click", [_this.calendarTime]);
    });
  };

  proto._bindCalendarBtn = function() {
    var _this = this;
    var $wrapper = document.querySelector('.' + CLASS.CALENDAR_WRAP);
    util.addEvent($wrapper, "click", function(ev) {
      var e = ev || window.event;
      var $target = e.target || e.srcElement;
      var year = new Date(_this.calendarShowTime).getFullYear();
      var month = new Date(_this.calendarShowTime).getMonth() + 1;
      if (!$target.classList.contains(CLASS.CALENDAR_BTN)) {
        return;
      }
      if ($target.classList.contains(CLASS.CALENDAR_PREV)) {
        _this._bindCalendarPrev(year, month);
      } else if ($target.classList.contains(CLASS.CALENDAR_NEXT)) {
        _this._bindCalendarNext(year, month);
      }
    });
  };

  proto._bindCalendarPrev = function(year, month) {
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.calendarShowTime = util.formatDate(
      new Date(year, month - 1, new Date(this.calendarTime).getDate()),
      "yyyy-MM"
    ).date;
    this._refreshCalendar(new Date(this.calendarShowTime));
  };

  proto._bindCalendarNext = function(year, month) {
    if (util.isLastDate(year, month)) {
      return;
    }
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.calendarShowTime = util.formatDate(
      new Date(year, month - 1, new Date(this.calendarTime).getDate()),
      "yyyy-MM"
    ).date;
    this._refreshCalendar(new Date(this.calendarShowTime));
  };

  return Calendar;
});
