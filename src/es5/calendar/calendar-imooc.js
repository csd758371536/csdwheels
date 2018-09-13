(function() {
  var datepicker = {};

  // 获取一个月的数据
  datepicker.getMonthData = function(year, month) {
    var ret = [];
    // 没有传入参数就使用当前日期
    if (!year || !month) {
        var today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
    }
    // 本月的第一天
    var firstDay = new Date(year, month - 1, 1);
    // 本月的第一天是星期几
    var firstDayWeekDay = firstDay.getDay();
    // 周日的值改为7
    if (firstDayWeekDay === 0) firstDayWeekDay = 7;

    year = firstDay.getFullYear();
    month = firstDay.getMonth() + 1;

    // 上月的最后一天
    var lastDayOfLastMonth = new Date(year, month - 1, 0);
    // 上月的最后一天的日期
    var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

    // 上月需要显示的日期数
    var preMonthDayCount = firstDayWeekDay - 1;
    // 本月的最后一天
    var lastDay = new Date(year, month, 0);
    // 本月的最后一天是星期几
    var lastDate = lastDay.getDate();

    for (var i = 0; i < 7 * 6; i++) {
        // 得到当前是哪一天
        var date = i + 1 - preMonthDayCount;
        var showDate = date;
        var thisMonth = month;
        if (date <= 0) {
            // 上一月
            thisMonth = month - 1;
            showDate = lastDateOfLastMonth + date;
        } else if (date > lastDate) {
            // 下一月
            thisMonth = month + 1;
            showDate = showDate - lastDate;
        }
        if (thisMonth === 0) {
            thisMonth = 12;
        }
        if (thisMonth === 13) {
            thisMonth = 1;
        }
        ret.push({
            month: thisMonth,
            date: date,
            showDate: showDate
        })
    }
    return {
        year: year,
        month: month,
        days: ret
    };
  };

  window.datepicker = datepicker;
})();

(function() {
    var datepicker = window.datepicker;
    var monthData;
    var $wrapper;
    datepicker.buildUI = function(year, month) {
        monthData = datepicker.getMonthData(year, month);
        var html = 
        '<div class="ui-datepicker-header">' + 
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' + 
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' + 
            '<span class="ui-datepicker-curr-month">'+ monthData.year + '-' + monthData.month +'</span>' + 
        '</div>' + 
        '<div class="ui-datepicker-body">' + 
            '<table>' + 
                '<thead>' + 
                    '<tr>' + 
                    '<th>一</th>' + 
                    '<th>二</th>' + 
                    '<th>三</th>' + 
                    '<th>四</th>' + 
                    '<th>五</th>' + 
                    '<th>六</th>' + 
                    '<th>日</th>' + 
                    '</tr>' + 
                '</thead>' + 
                '<tbody>'; 
        for (var i = 0; i < monthData.days.length; i++) {
            var date = monthData.days[i];
            if (i % 7 === 0) {
                html += '<tr>';
            }
            html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
            if (i % 7 === 6) {
                html += '</tr>';
            }
        }
        html += '</tbody></table></div>';
        return html
    };

    datepicker.render = function(direction) {
        var year, month;
        if (monthData) {
            year = monthData.year;
            month = monthData.month;
        }

        if (direction === 'prev') {
            month--
            if (month < 1) {
                month = 12;
                year--;
            }
        }
        if (direction === 'next') month++;

        var html = datepicker.buildUI(year, month);
        $wrapper = document.querySelector('.ui-datepicker-wrapper');
        if (!$wrapper) {
            $wrapper = document.createElement('div');
            document.body.appendChild($wrapper);
            $wrapper.className = 'ui-datepicker-wrapper';
        }
        $wrapper.innerHTML = html;
    }

    datepicker.init = function(input) {
        datepicker.render();

        var $input = document.querySelector(input);
        var isOpen = false;
        $input.addEventListener('click', function() {
            if (isOpen) {
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            } else {
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                $wrapper.style.top = top + height + 2 + 'px';
                $wrapper.style.left = left + 'px';
                isOpen = true;
            }
        }, false);

        $wrapper.addEventListener('click', function(e) {
            var $target = e.target;
            if (!$target.classList.contains('ui-datepicker-btn')) {
                return;
            }
            if ($target.classList.contains('ui-datepicker-prev-btn')) {
                datepicker.render('prev');
            } else if ($target.classList.contains('ui-datepicker-next-btn')) {
                datepicker.render('next');
            }
        }, false);

        $wrapper.addEventListener('click', function(e) {
            var $target = e.target;
            if ($target.tagName.toLowerCase() !== 'td') {
                return;
            }
            var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
            $input.value = format(date);
            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        }, false);
    };

    function format(date) {
        var ret = '';
        var padding = function(num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }
        ret += date.getFullYear() + '-';
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate());
        return ret;
    }
})();