;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Page = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function() {
        handler.call(element);
      });
    } else {
      element['on' + type] = handler;
    }
  }

  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  var Page = function(selector, pageOption, callback) {
    // 默认配置
    this.options = {
      ellipsis: true, // 是否显示省略号
      pageShow: 2
    };
    // 合并配置
    extend(this.options, pageOption, true);
    // 分页器元素
    this.pageElement = document.getElementById(selector);
    // 绑定事件
    this.pageEvent = callback;
  };

  Page.prototype = {
    construct: Page,
    initPage: function (dataCount, pageNumber) {
      // 数据总数
      this.dataCount = dataCount;
      // 当前页码
      this.pageNumber = pageNumber;
      // 总页数
      this.pageCount = Math.ceil(this.dataCount / this.options.pageSize);
      // 渲染
      this.renderPages();
      // 改变页数并触发事件
      this.changePage();
    },
    changePage: function() {
      var _this = this;
      var pageElement = _this.pageElement;
      addEvent(pageElement, 'click', function(ev) {
        var e = ev || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLocaleLowerCase() == 'a') {
          if (target.id === 'prev') {
            _this.prevPage();
          } else if (target.id === 'next') {
            _this.nextPage();
          } else if (target.id === 'first') {
            _this.firstPage();
          } else if (target.id === 'last') {
            _this.lastPage();
          } else if (target.id === 'page') {
            _this.goPage(parseInt(target.innerHTML));
          } else {
            return;
          }
          _this.pageEvent(_this.pageNumber, _this.options.pageSize);
        }
      });
    },
    renderPages: function() {
      var html = "";
      if (this.options.ellipsis) {
        html = this.renderEllipsis();
      } else {
        html = this.renderNoEllipsis();
      }
      this.pageElement.innerHTML = html;
    },
    renderNoEllipsis: function() {
      var html = "";
      var count;
      var pageShow = this.options.pageShow * 2 + 1;
      if (pageShow % 2 === 0) {
        count = 2;
      } else {
        count = 1;
      }
      if (this.pageNumber < (pageShow + count) / 2) {
        html = this.renderFirst(pageShow);
      } else if (this.pageCount - this.pageNumber < (pageShow - count) / 2) {
        html = this.renderLast(pageShow);
      } else {
        html = this.renderCenter(pageShow);
      }
      if (this.pageNumber > 1) {
        html = "<li><a href='javascript:;' id='first'>首页</a></li><li><a href='javascript:;' id='prev'>前一页</a></li>" + html;
      }
      if (this.pageNumber < this.pageCount) {
        html = html + "<li><a href='javascript:;' id='next'>后一页</a></li><li><a href='javascript:;' id='last'>尾页</a></li>";
      }
      return html;
    },
    renderEllipsis: function() {
      var html = "";
      html = "<li><a href='javascript:;' id='page' class='current'>" + this.pageNumber + "</a></li>";
      for (var i = 1; i <= this.options.pageShow; i++) {
        if (this.pageNumber - i > 1) {
          html = "<li><a href='javascript:;' id='page'>" + parseInt(this.pageNumber - i) + "</a></li>" + html;
        }
        if (this.pageNumber + i < this.pageCount) {
          html = html + "<li><a href='javascript:;' id='page'>" + parseInt(this.pageNumber + i) + "</a></li>";
        }
      }
      if (this.pageNumber - (this.options.pageShow + 1) > 1) {
        html = "<li><a href='javascript:;' id=''>...</a></li>" + html;
      }
      if (this.pageNumber > 1) {
        html = "<li><a href='javascript:;' id='first'>首页</a></li><li><a href='javascript:;' id='prev'>前一页</a></li><li><a href='javascript:;' id='page'>1</a></li>" + html;
      }
      if (this.pageNumber + this.options.pageShow + 1 < this.pageCount) {
        html = html + "<li><a href='javascript:;' id=''>...</a></li>";
      }
      if (this.pageNumber < this.pageCount) {
        html = html + "<li><a href='javascript:;' id='page'>" + this.pageCount + "</a></li><li><a href='javascript:;' id='next'>后一页</a></li><li><a href='javascript:;' id='last'>尾页</a></li>";
      }
      return html;
    },
    renderFirst: function(pageShow) {
      if (this.pageCount < pageShow) {
        return this.renderDom(1, this.pageCount);
      } else {
        return this.renderDom(1, pageShow);
      }
    },
    renderLast: function(pageShow) {
      if (this.pageCount < pageShow) {
        return this.renderDom(1, this.pageCount);
      } else {
        return this.renderDom(this.pageCount - pageShow + 1, this.pageCount);
      }
    },
    renderCenter: function(pageShow) {
      var begin, end;
      if (pageShow % 2 === 0) {
        begin = this.pageNumber - pageShow / 2;
        end = this.pageNumber + (pageShow - 2) / 2;
      } else {
        begin = this.pageNumber - (pageShow - 1) / 2;
        end = this.pageNumber + (pageShow - 1) / 2;
      }
      return this.renderDom(begin, end);
    },
    renderDom: function(begin, end) {
      var html = "";
      for (var i = begin; i <= end; i++) {
        var str = "";
        if (this.pageNumber === i) {
          str = " class='current'";
        }
        html = html + "<li><a href='javascript:;' id='page'" + str + ">" + i + "</a></li>";
      }
      return html;
    },
    prevPage: function() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.renderPages();
      }
    },
    nextPage: function() {
      if (this.pageNumber < this.pageCount) {
        this.pageNumber++;
        this.renderPages();
      }
    },
    goPage: function(pageNumber) {
      this.pageNumber = pageNumber;
      this.renderPages();
    },
    firstPage: function() {
      this.pageNumber = 1;
      this.renderPages();
    },
    lastPage: function() {
      this.pageNumber = this.pageCount;
      this.renderPages();
    }
  };

  return Page;
}));
