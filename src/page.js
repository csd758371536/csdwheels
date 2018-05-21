(function(root, factory) {
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

  function isPlainObject(obj) {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
      return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
  }

  function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == 'boolean') {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为 {}
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }
    // 循环遍历要复制的对象们
    for (; i < length; i++) {
      // 获取当前对象
      options = arguments[i];
      // 要求不能为空 避免 extend(a,,b) 这种情况
      if (options != null) {
        for (name in options) {
          // 目标属性值
          src = target[name];
          // 要复制的对象的属性值
          copy = options[name];
          // 解决循环引用
          if (target === copy) {
            continue;
          }
          // 要递归的对象必须是 plainObject 或者数组
          if (deep && copy && (isPlainObject(copy) ||
              (copyIsArray = Array.isArray(copy)))) {
            // 要复制的对象属性值类型需要与目标属性值相同
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  /*
   * dataCount: 数据总数
   * pageSize: 每页最多显示的数据数量
   * pageMax: 界面最多能显示的页码数量
   */
  var Page = function(option) {
    // 支持Page()或new Page()创建
    if (!(this instanceof Page)) return new Page();
    // 检查配置的必填参数是否错误
    if (!option.hasOwnProperty('dataCount')) {
      console.log('请传入数据总数！');
      return;
    }
    if (!option.hasOwnProperty('pageType')) {
      console.log('请传入分页类型！');
      return;
    }
    if (!option.hasOwnProperty('element')) {
      console.log('请传入分页器元素ID！');
      return;
    }
    if (option.pageType == 1) {
      // 合并默认配置
      option = extend(true, this.defaultOption1, option);
      // 最多显示页码数
      this.pageMax = option.pageMax;
    } else {
      // 合并默认配置
      option = extend(true, this.defaultOption2, option);
      // 当前页码前后最多显示的页码数量
      this.pageShow = option.pageShow;
    }
    // 分页器元素
    this.pageList = document.getElementById(option.element);
    // 分页类型
    this.pageType = option.pageType;
    // 当前页码
    this.pageNumber = 1;
    // 总页数
    this.pageCount = Math.ceil(option.dataCount / option.pageSize);
    // 绑定事件
    this.pageEvent = option.pageEvent;
    // 渲染
    this.renderPages();
    // 改变页数并触发事件
    this.changePage();
  };

  Page.prototype = {
    construct: Page,
    // 默认配置
    defaultOption1: {
      dataCount: 0,
      pageSize: 5,
      pageMax: 5,
      pageType: 1,
      pageEvent: function(pageNumber) {}
    },
    defaultOption2: {
      dataCount: 0,
      pageSize: 5,
      pageShow: 2,
      pageType: 2,
      pageEvent: function(pageNumber) {}
    },
    changePage: function() {
      var _this = this;
      var pagelist = _this.pageList;
      addEvent(pagelist, 'click', function(ev) {
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
          _this.pageEvent(_this.pageNumber);
        }
      });
    },
    renderPages: function() {
      var html = "";
      if (this.pageType === 1) {
        html = this.renderPageType1();
      } else {
        html = this.renderPageType2();
      }
      this.pageList.innerHTML = html;
    },
    renderPageType1: function() {
      var html = "";
      var count;
      if (this.pageMax % 2 === 0) {
        count = 2;
      } else {
        count = 1;
      }
      if (this.pageNumber < (this.pageMax + count) / 2) {
        html = this.renderFirst();
      } else if (this.pageCount - this.pageNumber < (this.pageMax - count) / 2) {
        html = this.renderLast();
      } else {
        html = this.renderCenter();
      }
      if (this.pageNumber > 1) {
        html = "<li><a href='javascript:;' id='first'>首页</a></li><li><a href='javascript:;' id='prev'>前一页</a></li>" + html;
      }
      if (this.pageNumber < this.pageCount) {
        html = html + "<li><a href='javascript:;' id='next'>后一页</a></li><li><a href='javascript:;' id='last'>尾页</a></li>";
      }
      return html;
    },
    renderPageType2: function() {
      var html = "";
      html = "<li><a href='javascript:;' id='page' class='current'>" + this.pageNumber + "</a></li>";
      for (var i = 1; i <= this.pageShow; i++) {
        if (this.pageNumber - i > 1) {
          html = "<li><a href='javascript:;' id='page'>" + parseInt(this.pageNumber - i) + "</a></li>" + html;
        }
        if (this.pageNumber + i < this.pageCount) {
          html = html + "<li><a href='javascript:;' id='page'>" + parseInt(this.pageNumber + i) + "</a></li>";
        }
      }

      if (this.pageNumber - (this.pageShow + 1) > 1) {
        html = "<li><a href='javascript:;' id=''>...</a></li>" + html;
      }
      if (this.pageNumber > 1) {
        html = "<li><a href='javascript:;' id='first'>首页</a></li><li><a href='javascript:;' id='prev'>前一页</a></li><li><a href='javascript:;' id='page'>1</a></li>" + html;
      }
      if (this.pageNumber + this.pageShow + 1 < this.pageCount) {
        html = html + "<li><a href='javascript:;' id=''>...</a></li>";
      }
      if (this.pageNumber < this.pageCount) {
        html = html + "<li><a href='javascript:;' id='page'>" + this.pageCount + "</a></li><li><a href='javascript:;' id='next'>后一页</a></li><li><a href='javascript:;' id='last'>尾页</a></li>";
      }
      return html;
    },
    renderFirst: function() {
      if (this.pageCount < this.pageMax) {
        return this.renderDom(1, this.pageCount);
      } else {
        return this.renderDom(1, this.pageMax);
      }
    },
    renderLast: function() {
      if (this.pageCount < this.pageMax) {
        return this.renderDom(1, this.pageCount);
      } else {
        return this.renderDom(this.pageCount - this.pageMax + 1, this.pageCount);
      }
    },
    renderCenter: function() {
      var begin, end;
      if (this.pageMax % 2 === 0) {
        begin = this.pageNumber - this.pageMax / 2;
        end = this.pageNumber + (this.pageMax - 2) / 2;
      } else {
        begin = this.pageNumber - (this.pageMax - 1) / 2;
        end = this.pageNumber + (this.pageMax - 1) / 2;
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
