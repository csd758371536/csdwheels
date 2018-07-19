;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Pagination = factory();
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

  var Pagination = function(selector, pageOption, callback) {
    // 默认配置
    this.options = {
      pageShow: 2,
      ellipsis: true
    };
    // 合并配置
    extend(this.options, pageOption, true);
    // 分页器元素
    this.pageElement = document.getElementById(selector);
    // 绑定事件
    this.pageEvent = callback;
  };

  Pagination.prototype = {
    construct: Pagination,
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
      this.pageElement.innerHTML = '';
      if (this.options.ellipsis) {
        this.pageElement.appendChild(this.renderEllipsis());
      } else {
        this.pageElement.appendChild(this.renderNoEllipsis());
      }
    },
    renderNoEllipsis: function() {
      var fragment = document.createDocumentFragment();
      var count;
      var pageShow = this.options.pageShow * 2 + 1;
      if (pageShow % 2 === 0) {
        count = 2;
      } else {
        count = 1;
      }
      if (this.pageNumber < (pageShow + count) / 2) {
        fragment.appendChild(this.renderFirst(pageShow));
      } else if (this.pageCount - this.pageNumber < (pageShow - count) / 2) {
        fragment.appendChild(this.renderLast(pageShow));
      } else {
        fragment.appendChild(this.renderCenter(pageShow));
      }
      if (this.pageNumber > 1) {
        fragment.insertBefore(this.createHtml([
          {
            id: 'first',
            className: '',
            content: '首页'
          },
          {
            id: 'prev',
            className: '',
            content: '前一页'
          }
        ]), fragment.firstChild);
      }
      if (this.pageNumber < this.pageCount) {
        fragment.appendChild(this.createHtml([
          {
            id: 'next',
            className: '',
            content: '后一页'
          },
          {
            id: 'last',
            className: '',
            content: '尾页'
          }
        ]));
      }
      return fragment;
    },
    renderEllipsis: function() {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.createHtml([
        {
          id: 'page',
          className: 'current',
          content: this.pageNumber
        }
      ]));
      for (var i = 1; i <= this.options.pageShow; i++) {
        if (this.pageNumber - i > 1) {
          fragment.insertBefore(this.createHtml([
            {
              id: 'page',
              className: '',
              content: this.pageNumber - i
            }
          ]), fragment.firstChild);
        }
        if (this.pageNumber + i < this.pageCount) {
          fragment.appendChild(this.createHtml([
            {
              id: 'page',
              className: '',
              content: this.pageNumber + i
            }
          ]));
        }
      }
      if (this.pageNumber - (this.options.pageShow + 1) > 1) {
        fragment.insertBefore(this.createHtml([
          {
            id: '',
            className: '',
            content: '...'
          }
        ]), fragment.firstChild);
      }
      if (this.pageNumber > 1) {
        fragment.insertBefore(this.createHtml([
          {
            id: 'first',
            className: '',
            content: '首页'
          },
          {
            id: 'prev',
            className: '',
            content: '前一页'
          },
          {
            id: 'page',
            className: '',
            content: '1'
          }
        ]), fragment.firstChild);
      }
      if (this.pageNumber + this.options.pageShow + 1 < this.pageCount) {
        fragment.appendChild(this.createHtml([
          {
            id: '',
            className: '',
            content: '...'
          }
        ]));
      }
      if (this.pageNumber < this.pageCount) {
        fragment.appendChild(this.createHtml([
          {
            id: 'page',
            className: '',
            content: this.pageCount
          },
          {
            id: 'next',
            className: '',
            content: '后一页'
          },
          {
            id: 'last',
            className: '',
            content: '尾页'
          }
        ]));
      }
      return fragment;
    },
    createHtml: function(elemDatas) {
      var fragment = document.createDocumentFragment();
      var liEle = document.createElement("li");
      var aEle = document.createElement("a");
      elemDatas.forEach(function (elementData, index) {
        liEle = liEle.cloneNode(false);
        aEle = aEle.cloneNode(false);
        aEle.setAttribute('href', 'javascript:;');
        aEle.setAttribute('id', elementData.id);
        aEle.setAttribute('class', elementData.className);
        aEle.innerHTML = elementData.content;
        liEle.appendChild(aEle);
        fragment.appendChild(liEle);
      });
      return fragment;
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
      var fragment = document.createDocumentFragment();
      for (var i = begin; i <= end; i++) {
        var str = '';
        if (this.pageNumber === i) {
          str = 'current';
        }
        fragment.appendChild(this.createHtml([
          {
            id: 'page',
            className: str,
            content: i
          }
        ]));
      }
      return fragment;
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

  return Pagination;
}));
