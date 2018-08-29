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
    CALENDAR_DATE: '#calendarDate',
    CALENDAR_DATE_TIME: '#calendarDateTime',
    CALENDAR_DATE_PREV: '#calendarDatePrev',
    CALENDAR_DATE_NEXT: '#calendarDateNext',
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
    // 设置日历时间（默认为当前时间）
    this.calendarTime = this.obtainDate(new Date());
    console.log(this.calendarTime)
    // 设置所有要显示的日期
    // this.setCalendarDays(new Date("2018-7-21"));
    this.setCalendarDays(new Date());
    // 渲染DOM
    this.renderCalendar(new Date().getDate());
    // 获取日历元素
    this.getCalendar();
    // 绑定事件
    this.bindCalendar();
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
      // 日历行数
      this.calendarRow = Math.floor(this.calendarMaxDay / this.calendarWeeks.length) + 2;
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
      // 要显示的日期数
      this.calendarDaysCount = this.calendarWeeks.length * this.calendarRow;
      // 保存所有要显示的日期
      this.calendarDays = [];
    },
    getCalendar: function() {
      this.calendarDateElem = document.querySelector(ID.CALENDAR_DATE);
      this.calendarDayElems = document.getElementsByClassName(CLASS.CALENDAR_DAY);
    },
    setCalendarDays: function(date) {
      // 获取当前月第一天是星期几
      var week = this.getFirstDateInMonth(date).getDay();
      // 获取上个月最后一天的日期
      var lastDateInPrevMonth = this.getLastDateInPrevMonth(date).getDate();
      // var calendarDayTime = date;
      console.log(date.getFullYear())
      console.log(date.getMonth() + 1)
      // 判断第一天是否是星期日
      if (week != 0) {
        // 设置上个月显示日期
        this.setCalendarDaysInMonth(
          date.getFullYear(),
          date.getMonth(),
          lastDateInPrevMonth - week + 1,
          lastDateInPrevMonth, false
        );
      } else {
        // 设置上个月显示日期
        this.setCalendarDaysInMonth(
          date.getFullYear(),
          date.getMonth(),
          lastDateInPrevMonth - this.calendarWeeks.length + 1,
          lastDateInPrevMonth, false
        );
      }
      // 获取当前月最后一天的日期
      var lastDateInCurrentMonth = this.getLastDateInMonth(date).getDate();
      // 设置当前月份的显示日期
      this.setCalendarDaysInMonth(date.getFullYear(), date.getMonth() + 1, 1, lastDateInCurrentMonth, true);
      if (this.calendarDays.length != this.calendarDaysCount) {
        // 设置下个月显示日期
        this.setCalendarDaysInMonth(
          date.getFullYear(),
          date.getMonth() + 2,
          1,
          this.calendarDaysCount - this.calendarDays.length, false
        );
      }
      console.log(this.calendarDays);
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
    renderCalendar: function(selectDate) {
      // 第一种模式：显示天数
      var calendarWrapElem = document.createElement("div");
      calendarWrapElem.setAttribute("class", CLASS.CALENDAR_WRAP);
      calendarWrapElem.setAttribute('id', ID.CALENDAR_DATE.substring(1, ID.CALENDAR_DATE.length));
      calendarWrapElem.appendChild(this.renderCalendarTitle());
      calendarWrapElem.appendChild(this.renderCalendarContent(selectDate));
      this.calendar.appendChild(calendarWrapElem);
    },
    renderCalendarTitle: function() {
      var calendarTitleElem = document.createElement("div");
      calendarTitleElem.setAttribute("class", CLASS.CALENDAR_TITLE);
      var calendarPrevElem = document.createElement("span");
      calendarPrevElem.setAttribute("class", CLASS.CALENDAR_PREV);
      calendarPrevElem.setAttribute('id', ID.CALENDAR_DATE_PREV.substring(1, ID.CALENDAR_DATE_PREV.length));
      calendarPrevElem.innerHTML = '&lt;';
      var calendarTimeElem = document.createElement("span");
      calendarTimeElem.setAttribute("class", CLASS.CALENDAR_TIME);
      calendarTimeElem.setAttribute('id', ID.CALENDAR_DATE_TIME.substring(1, ID.CALENDAR_DATE_TIME.length));
      calendarTimeElem.innerHTML = this.calendarTime;
      var calendarNextElem = document.createElement("span");
      calendarNextElem.setAttribute("class", CLASS.CALENDAR_NEXT);
      calendarNextElem.setAttribute('id', ID.CALENDAR_DATE_NEXT.substring(1, ID.CALENDAR_DATE_NEXT.length));
      calendarNextElem.innerHTML = '&gt;';
      calendarTitleElem.appendChild(calendarPrevElem);
      calendarTitleElem.appendChild(calendarTimeElem);
      calendarTitleElem.appendChild(calendarNextElem);
      return calendarTitleElem;
    },
    renderCalendarContent: function(selectDate) {
      var calendarContentElem = document.createElement("table");
      calendarContentElem.setAttribute("class", CLASS.CALENDAR_CONTENT);
      calendarContentElem.appendChild(this.renderCalendarWeeks());
      calendarContentElem.appendChild(this.renderCalendarDays(selectDate));
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
    renderCalendarDays: function(selectDate) {
      var calendarDaysFragment = document.createDocumentFragment();
      for (var i = 0; i < this.calendarRow; i++) {
        var calendarDaysElem = document.createElement("tr");
        calendarDaysElem.setAttribute("class", CLASS.CALENDAR_DAYS);
        var calendarDays = this.calendarDays.slice(i * this.calendarWeeks.length, i * this.calendarWeeks.length + this.calendarWeeks.length);
        var fragment = document.createDocumentFragment();
        var calendarDayElem = document.createElement("td");
        for (var j = 0; j < calendarDays.length; j++) {
          calendarDayElem = calendarDayElem.cloneNode(false);
          if (calendarDays[j].isCurrent) {
            if (calendarDays[j].day === selectDate) {
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
      var _this = this;
      addEvent(document.querySelector('.calendar-content'), 'click', function (ev) {
        var e = ev || window.event;
        var target = e.target || e.srcElement;
        console.log(e)
        if (target.nodeName.toLocaleLowerCase() == "td") {
          for (var i = 0; i < _this.calendarDayElems.length; i++) {
            if (_this.calendarDayElems[i] === target) {
              _this.calendarTime = _this.calendarDays[i].year + "-" + _this.calendarDays[i].month + "-" + _this.calendarDays[i].day;
              document.querySelector(ID.CALENDAR_DATE_TIME).innerHTML = _this.calendarTime;
              _this.calendarDayElems[i].setAttribute("class", CLASS.CALENDAR_DAY_SELECT);
            } else {
              if (_this.calendarDays[i].isCurrent) {
                _this.calendarDayElems[i].setAttribute("class", CLASS.CALENDAR_DAY_CURRENT);
              } else {
                _this.calendarDayElems[i].setAttribute("class", CLASS.CALENDAR_DAY);
              }
            }
          }
        }
      });
      addEvent(document.querySelector(ID.CALENDAR_DATE_PREV), 'click', function (ev) {
        
      });
      addEvent(document.querySelector(ID.CALENDAR_DATE_NEXT), 'click', function (ev) {
        
      });
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
