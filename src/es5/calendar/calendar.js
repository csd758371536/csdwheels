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

  var CLASS = {
    CALENDAR_WRAP: 'calendar-wrap',
    CALENDAR_TITLE: 'calendar-title',
    CALENDAR_PREV: 'calendar-prev',
    CALENDAR_TIME: 'calendar-time',
    CALENDAR_NEXT: 'calendar-next',
    CALENDAR_CONTENT: 'calendar-content',
    CALENDAR_WEEKS: 'calendar-weeks',
    CALENDAR_WEEK: 'calendar-week',
    CALENDAR_DAYS: 'calendar-days',
    CALENDAR_DAY: 'calendar-day',
    CALENDAR_DAY_CURRENT: 'calendar-day current',
    CALENDAR_DAY_SELECT: 'calendar-day select'
  };

  var ID = {
    CALENDAR_DATE: 'calendarDate',
    CALENDAR_DATE_TIME: 'calendarDateTime',
    CALENDAR_DATE_PREV: 'calendarDatePrev',
    CALENDAR_DATE_NEXT: 'calendarDateNext',
  };

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
    // 日历设置时间（默认为当前时间）
    this.calendarTime = this.obtainDate(new Date(this.calendarOptions.time), true);
    // 日历显示时间
    this.calendarShowTime = this.obtainDate(new Date(this.calendarOptions.time), false);
    this.refreshCalendar(new Date(this.calendarOptions.time));
    this.calendarOptions.callback && this.calendarOptions.callback(this.calendarTime);
  };
  Calendar.prototype = {
    calendarOptions: {},
    initCalendar: function(selector) {
      // 获取日历元素
      this.calendar = document.querySelector(selector);
      // 因为一周有7天，一个月最多有31天，一个月最多能横跨6行，所以至少要7*6=42个格子，其余的格子用前后月份日期补足
      this.calendarWeeks = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      // 每个月最大天数
      this.calendarMaxDay = 31;
      // 最大日期
      this.calendarMax = this.obtainDate(new Date(8640000000000000), true);
      // 最小日期
      this.calendarMin = '100-01-01';
      // 日历行数
      this.calendarRow = Math.floor(this.calendarMaxDay / this.calendarWeeks.length) + 2;
      // 要显示的日期数
      this.calendarDaysCount = this.calendarWeeks.length * this.calendarRow;
    },
    refreshCalendar: function(date) {
      // 设置所有要显示的日期
      this.setCalendarDays(date);
      // 渲染DOM
      this.renderCalendar();
      // 获取日历元素
      this.getCalendar();
      // 绑定事件
      this.bindCalendar();
    },
    getCalendar: function() {
      this.calendarDateElem = document.querySelector('#' + ID.CALENDAR_DATE);
      this.calendarDayElems = document.querySelectorAll('.' + CLASS.CALENDAR_DAY);
      this.calendarContentElem = document.querySelector('.' + CLASS.CALENDAR_CONTENT);
      this.calendarDateTimeElem = document.querySelector('#' + ID.CALENDAR_DATE_TIME);
      this.calendarDatePrev = document.querySelector('#' + ID.CALENDAR_DATE_PREV);
      this.calendarDateNext = document.querySelector('#' + ID.CALENDAR_DATE_NEXT);
    },
    setCalendarDays: function(date) {
      // 保存所有要显示的日期
      this.calendarDays = [];
      // 设置上个月显示日期
      this.setCalendarDaysInPrevMonth(date);
      // 设置当前月的显示日期
      this.setCalendarDaysInCurrentMonth(date);
      // 设置下个月显示日期
      this.setCalendarDaysInNextMonth(date);
    },
    setCalendarDaysInPrevMonth: function(date) {
      // 获取当前月第一天是星期几
      var week = this.getFirstDateInMonth(date).getDay();
      // 获取上个月最后一天的日期
      var end = this.getLastDateInPrevMonth(date).getDate();
      // 判断第一天是否是星期日 设置起始日期
      var start = week === 0 ? end - this.calendarWeeks.length + 1 : end - week + 1;
      this.setCalendarDaysInMonth(
        date.getMonth() < 1 ? date.getFullYear() - 1 : date.getFullYear(),
        date.getMonth() < 1 ? 12 : date.getMonth(),
        start,
        end, false
      );
    },
    setCalendarDaysInCurrentMonth: function(date) {
      // 获取当前月最后一天的日期
      var end;
      // 判断是否是最后一个月的日期
      if (this.isLastDate(date.getFullYear(), date.getMonth() + 1)) {
        end = new Date(this.calendarMax).getDate();
      } else {
        end = this.getLastDateInMonth(date).getDate();
      }
      this.setCalendarDaysInMonth(date.getFullYear(), date.getMonth() + 1, 1, end, true);
    },
    setCalendarDaysInNextMonth: function(date) {
      // 判断是否是最后一个月的日期
      if (!this.isLastDate(date.getFullYear(), date.getMonth() + 1)) {
        if (this.calendarDays.length != this.calendarDaysCount) {
          this.setCalendarDaysInMonth(
            date.getMonth() + 2 > 12 ? date.getFullYear() + 1 : date.getFullYear(),
            date.getMonth() + 2 > 12 ? 1 : date.getMonth() + 2,
            1,
            this.calendarDaysCount - this.calendarDays.length, false
          );
        }
      }
    },
    setCalendarDaysInMonth: function(year, month, start, end, isCurrent) {
      for (var day = start, len = end; day <= len; day++) {
        this.calendarDays.push({
          year: year,
          month: month,
          day: day,
          isCurrent: isCurrent
        });
      }
    },
    renderCalendar: function() {
      this.calendar.innerHTML = '';
      // 第一种模式：显示天数
      var calendarWrapElem = document.createElement("div");
      calendarWrapElem.setAttribute("class", CLASS.CALENDAR_WRAP);
      calendarWrapElem.setAttribute('id', ID.CALENDAR_DATE);
      calendarWrapElem.appendChild(this.renderCalendarTitle());
      calendarWrapElem.appendChild(this.renderCalendarContent());
      this.calendar.appendChild(calendarWrapElem);
    },
    renderCalendarTitle: function() {
      var calendarTitleElem = document.createElement("div");
      calendarTitleElem.setAttribute("class", CLASS.CALENDAR_TITLE);
      var calendarPrevElem = document.createElement("span");
      calendarPrevElem.setAttribute("class", CLASS.CALENDAR_PREV);
      calendarPrevElem.setAttribute('id', ID.CALENDAR_DATE_PREV);
      calendarPrevElem.innerHTML = '&lt;';
      var calendarTimeElem = document.createElement("span");
      calendarTimeElem.setAttribute("class", CLASS.CALENDAR_TIME);
      calendarTimeElem.setAttribute('id', ID.CALENDAR_DATE_TIME);
      calendarTimeElem.innerHTML = this.calendarShowTime;
      var calendarNextElem = document.createElement("span");
      calendarNextElem.setAttribute("class", CLASS.CALENDAR_NEXT);
      calendarNextElem.setAttribute('id', ID.CALENDAR_DATE_NEXT);
      calendarNextElem.innerHTML = '&gt;';
      calendarTitleElem.appendChild(calendarPrevElem);
      calendarTitleElem.appendChild(calendarTimeElem);
      calendarTitleElem.appendChild(calendarNextElem);
      return calendarTitleElem;
    },
    renderCalendarContent: function() {
      var calendarContentElem = document.createElement("table");
      calendarContentElem.setAttribute("class", CLASS.CALENDAR_CONTENT);
      calendarContentElem.appendChild(this.renderCalendarWeeks());
      calendarContentElem.appendChild(this.renderCalendarDays());
      return calendarContentElem;
    },
    renderCalendarWeeks: function() {
      var calendarWeeksElem = document.createElement("tr");
      calendarWeeksElem.setAttribute("class", CLASS.CALENDAR_WEEKS);
      var fragment = document.createDocumentFragment();
      var calendarWeekElem = document.createElement("th");
      this.calendarWeeks.forEach(function(calendarWeek, index) {
        calendarWeekElem = calendarWeekElem.cloneNode(false);
        calendarWeekElem.setAttribute("class", CLASS.CALENDAR_WEEK);
        calendarWeekElem.innerHTML = calendarWeek;
        fragment.appendChild(calendarWeekElem);
      });
      calendarWeeksElem.appendChild(fragment);
      return calendarWeeksElem;
    },
    renderCalendarDays: function() {
      var calendarDaysFragment = document.createDocumentFragment();
      var len = this.calendarWeeks.length;
      for (var i = 0; i < this.calendarRow; i++) {
        var calendarDaysElem = document.createElement("tr");
        calendarDaysElem.setAttribute("class", CLASS.CALENDAR_DAYS);
        var calendarDays = this.calendarDays.slice(i * len, i * len + len);
        var fragment = document.createDocumentFragment();
        var calendarDayElem = document.createElement("td");
        for (var j = 0; j < calendarDays.length; j++) {
          calendarDayElem = calendarDayElem.cloneNode(false);
          if (calendarDays[j].isCurrent) {
            if (calendarDays[j].day === new Date(this.calendarTime).getDate() 
              && calendarDays[j].year === new Date(this.calendarTime).getFullYear() 
              && calendarDays[j].month === new Date(this.calendarTime).getMonth() + 1) {
              calendarDayElem.setAttribute("class", CLASS.CALENDAR_DAY_SELECT);
            } else {
              calendarDayElem.setAttribute("class", CLASS.CALENDAR_DAY_CURRENT);
            }
          } else {
            calendarDayElem.setAttribute("class", CLASS.CALENDAR_DAY);
          }
          calendarDayElem.innerHTML = calendarDays[j].day;
          fragment.appendChild(calendarDayElem);
        }
        calendarDaysElem.appendChild(fragment);
        calendarDaysFragment.appendChild(calendarDaysElem);
      }
      return calendarDaysFragment;
    },
    bindCalendar: function() {
      var year = new Date(this.calendarShowTime).getFullYear();
      var month = new Date(this.calendarShowTime).getMonth() + 1;
      this.bindCalendarContent();
      this.bindCalendarPrev(year, month);
      this.bindCalendarNext(year, month);
    },
    bindCalendarContent: function() {
      var _this = this;
      var arr = [];
      addEvent(this.calendarContentElem, 'click', function (ev) {
        var e = ev || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLocaleLowerCase() == "td") {
          for (var i = 0; i < _this.calendarDayElems.length; i++) {
            if (_this.calendarDayElems[i] === target) {
              arr = [_this.calendarDays[i].month, _this.calendarDays[i].day];
              arr.forEach(function(item, index) {
                arr[index] = item < 10 ? "0" + item : item;
              });
              _this.calendarTime = new Date(_this.calendarDays[i].year.toString()).getFullYear() + '-' + arr[0] + '-' + arr[1];
              _this.calendarShowTime = new Date(_this.calendarDays[i].year.toString()).getFullYear() + '-' + arr[0];
              _this.refreshCalendar(new Date(_this.calendarTime));
            }
          }
          _this.calendarOptions.callback && _this.calendarOptions.callback(_this.calendarTime);
        }
      });
    },
    bindCalendarPrev: function(year, month) {
      var _this = this;
      addEvent(this.calendarDatePrev, 'click', function (ev) {
        month--;
        if (month < 1) {
          month = 12;
          year--;
        }
        month = month < 10 ? "0" + month : month;
        _this.calendarShowTime = new Date(year.toString()).getFullYear() + '-' + month;
        _this.refreshCalendar(new Date(_this.calendarShowTime));
      });
    },
    bindCalendarNext: function(year, month) {
      if (this.isLastDate(year, month)) {
        return;
      }
      var _this = this;
      addEvent(this.calendarDateNext, 'click', function (ev) {
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        month = month < 10 ? "0" + month : month;
        _this.calendarShowTime = year + '-' + month;
        _this.refreshCalendar(new Date(_this.calendarShowTime));
      });
    },
    // 判断是否是最后一月
    isLastDate: function(year, month) {
      return year === new Date(this.calendarMax).getFullYear() && month === new Date(this.calendarMax).getMonth() + 1;
    },
    isFirstDate: function(year, month) {
      return year === new Date(this.calendarMin).getFullYear() && month === new Date(this.calendarMin).getMonth() + 1;
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
    /**
     * new Date()格式化为yyyy-MM-dd
     */
    obtainDate: function(date, isShowDay) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      // 判断是否满10
      var arr = [month, day];
      arr.forEach(function(item, index) {
        arr[index] = item < 10 ? "0" + item : item;
      });
      if (isShowDay) {
        return year + "-" + arr[0] + "-" + arr[1];
      } else {
        return year + "-" + arr[0];
      }
    },
    constructor: Calendar
  };

  return Calendar;
});
