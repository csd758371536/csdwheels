(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Pagination = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // 跨浏览器事件对象
  var EventUtil = {
    addEvent: function(element, type, handler) {
      // 添加绑定
      if (element.addEventListener) {
        // 使用DOM2级方法添加事件
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        // 使用IE方法添加事件
        element.attachEvent("on" + type, handler);
      } else {
        // 使用DOM0级方法添加事件
        element["on" + type] = handler;
      }
    },
    // 移除事件
    removeEvent: function(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.datachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    },
    getEvent: function(event) {
      // 返回事件对象引用
      return event ? event : window.event;
    },
    // 获取mouseover和mouseout相关元素
    getRelatedTarget: function(event) {
      if (event.relatedTarget) {
        return event.relatedTarget;
      } else if (event.toElement) {
        // 兼容IE8-
        return event.toElement;
      } else if (event.formElement) {
        return event.formElement;
      } else {
        return null;
      }
    },
    getTarget: function(event) {
      //返回事件源目标
      return event.target || event.srcElement;
    },
    preventDefault: function(event) {
      //取消默认事件
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    stoppropagation: function(event) {
      //阻止事件流
      if (event.stoppropagation) {
        event.stoppropagation();
      } else {
        event.canceBubble = false;
      }
    },
    // 获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
    getButton: function(event) {
      if (document.implementation.hasFeature("MouseEvents", "2.0")) {
        return event.button;
      } else {
        //将IE模型下的button属性映射为DOM模型下的button属性
        switch (event.button) {
          case 0:
          case 1:
          case 3:
          case 5:
          case 7:
            //按下的是鼠标主按钮（一般是左键）
            return 0;
          case 2:
          case 6:
            //按下的是中间的鼠标按钮
            return 2;
          case 4:
            //鼠标次按钮（一般是右键）
            return 1;
        }
      }
    },
    //获取表示鼠标滚轮滚动方向的数值
    getWheelDelta: function(event) {
      if (event.wheelDelta) {
        return event.wheelDelta;
      } else {
        return -event.detail * 40;
      }
    },
    // 以跨浏览器取得相同的字符编码，需在keypress事件中使用
    getCharCode: function(event) {
      if (typeof event.charCode == "number") {
        return event.charCode;
      } else {
        return event.keyCode;
      }
    }
  };

  // 浅拷贝一个对象的属性
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  var Pagination = function(pageOption) {
    // 默认配置
    this.options = {
      curr: 1,
      pageShow: 2,
      ellipsis: true,
      hash: false
    };
    // 合并配置
    extend(this.options, pageOption, true);
    // 分页器元素
    this.pageElement = document.getElementById(this.options.elem);
    // 数据总数
    this.dataCount = this.options.count;
    // 当前页码
    this.pageNumber = this.options.curr;
    // 总页数
    this.pageCount = Math.ceil(this.options.count / this.options.limit);
    // 渲染
    this.renderPages();
    // 执行回调函数
    this.options.callback && this.options.callback({
      curr: this.pageNumber,
      limit: this.options.limit,
      isFirst: true
    });
    // 改变页数并触发事件
    this.changePage();
  };

  Pagination.prototype = {
    construct: Pagination,
    pageInfos: [{
        id: "first",
        className: "",
        content: "首页"
      },
      {
        id: "prev",
        className: "",
        content: "前一页"
      },
      {
        id: "next",
        className: "",
        content: "后一页"
      },
      {
        id: "last",
        className: "",
        content: "尾页"
      },
      {
        id: "",
        className: "",
        content: "..."
      },
      {
        id: "page",
        className: "",
        content: "1"
      }
    ],
    getPageInfos: function(className, content) {
      return {
        id: "page",
        className: className,
        content: content
      };
    },
    changePage: function() {
      var _this = this;
      var pageElement = _this.pageElement;
      EventUtil.addEvent(pageElement, "click", function(ev) {
        var e = ev || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLocaleLowerCase() == "a") {
          if (target.id === "prev") {
            _this.prevPage();
          } else if (target.id === "next") {
            _this.nextPage();
          } else if (target.id === "first") {
            _this.firstPage();
          } else if (target.id === "last") {
            _this.lastPage();
          } else if (target.id === "page") {
            _this.goPage(parseInt(target.innerHTML));
          } else {
            return;
          }
          _this.renderPages();
          _this.options.callback && _this.options.callback({
            curr: _this.pageNumber,
            limit: _this.options.limit,
            isFirst: false
          });
          _this.pageHash();
        }
      });
    },
    pageHash: function() {
      if (this.options.hash) {
        window.location.hash = '#!' + this.options.hash + '=' + this.pageNumber;
      }
    },
    renderPages: function() {
      this.pageElement.innerHTML = "";
      if (this.options.ellipsis) {
        this.pageElement.appendChild(this.renderEllipsis());
      } else {
        this.pageElement.appendChild(this.renderNoEllipsis());
      }
    },
    renderNoEllipsis: function() {
      var fragment = document.createDocumentFragment();
      var count = pageMax % 2 === 0 ? 2 : 1;
      var pageMax = this.options.pageShow * 2 + 1;
      if (this.pageNumber < (pageMax + count) / 2) {
        fragment.appendChild(this.renderFirst(pageMax));
      } else if (this.pageCount - this.pageNumber < (pageMax - count) / 2) {
        fragment.appendChild(this.renderLast(pageMax));
      } else {
        fragment.appendChild(this.renderCenter(pageMax));
      }
      if (this.pageNumber > 1) {
        this.addFragmentBefore(fragment, [
          this.pageInfos[0],
          this.pageInfos[1]
        ]);
      }
      if (this.pageNumber < this.pageCount) {
        this.addFragmentAfter(fragment, [this.pageInfos[2], this.pageInfos[3]]);
      }
      return fragment;
    },
    renderEllipsis: function() {
      var fragment = document.createDocumentFragment();
      this.addFragmentAfter(fragment, [
        this.getPageInfos("current", this.pageNumber)
      ]);
      for (var i = 1; i <= this.options.pageShow; i++) {
        if (this.pageNumber - i > 1) {
          this.addFragmentBefore(fragment, [
            this.getPageInfos("", this.pageNumber - i)
          ]);
        }
        if (this.pageNumber + i < this.pageCount) {
          this.addFragmentAfter(fragment, [
            this.getPageInfos("", this.pageNumber + i)
          ]);
        }
      }
      if (this.pageNumber - (this.options.pageShow + 1) > 1) {
        this.addFragmentBefore(fragment, [this.pageInfos[4]]);
      }
      if (this.pageNumber > 1) {
        this.addFragmentBefore(fragment, [
          this.pageInfos[0],
          this.pageInfos[1],
          this.pageInfos[5]
        ]);
      }
      if (this.pageNumber + this.options.pageShow + 1 < this.pageCount) {
        this.addFragmentAfter(fragment, [this.pageInfos[4]]);
      }
      if (this.pageNumber < this.pageCount) {
        this.addFragmentAfter(fragment, [
          this.getPageInfos("", this.pageCount),
          this.pageInfos[2],
          this.pageInfos[3]
        ]);
      }
      return fragment;
    },
    addFragmentBefore: function(fragment, datas) {
      fragment.insertBefore(this.createHtml(datas), fragment.firstChild);
    },
    addFragmentAfter: function(fragment, datas) {
      fragment.appendChild(this.createHtml(datas));
    },
    createHtml: function(elemDatas) {
      var fragment = document.createDocumentFragment();
      var liEle = document.createElement("li");
      var aEle = document.createElement("a");
      elemDatas.forEach(function(elementData, index) {
        liEle = liEle.cloneNode(false);
        aEle = aEle.cloneNode(false);
        aEle.setAttribute("href", "javascript:;");
        aEle.setAttribute("id", elementData.id);
        aEle.setAttribute("class", elementData.className);
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
      var begin =
        pageShow % 2 === 0 ?
        this.pageNumber - pageShow / 2 :
        this.pageNumber - (pageShow - 1) / 2;
      var end =
        pageShow % 2 === 0 ?
        this.pageNumber + (pageShow - 2) / 2 :
        this.pageNumber + (pageShow - 1) / 2;
      return this.renderDom(begin, end);
    },
    renderDom: function(begin, end) {
      var fragment = document.createDocumentFragment();
      var str = "";
      for (var i = begin; i <= end; i++) {
        str = this.pageNumber === i ? "current" : "";
        this.addFragmentAfter(fragment, [this.getPageInfos(str, i)]);
      }
      return fragment;
    },
    prevPage: function() {
      this.pageNumber--;
    },
    nextPage: function() {
      this.pageNumber++;
    },
    goPage: function(pageNumber) {
      this.pageNumber = pageNumber;
    },
    firstPage: function() {
      this.pageNumber = 1;
    },
    lastPage: function() {
      this.pageNumber = this.pageCount;
    }
  };

  return Pagination;
});
