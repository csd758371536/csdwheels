// 引入样式

class Pagination {
  constructor(selector, options = {}) {
    // 默认配置
    this.options = {
      curr: 1,
      pageShow: 2,
      ellipsis: true,
      hash: false
    };
    Object.assign(this.options, options);
    this.init(selector);
  }

  // 元素类名
  static CLASS_NAME = {
    ITEM: 'pagination-item',
    LINK: 'pagination-link'
  }

  static PageInfos = [{
      id: "first",
      content: "首页"
    },
    {
      id: "prev",
      content: "前一页"
    },
    {
      id: "next",
      content: "后一页"
    },
    {
      id: "last",
      content: "尾页"
    },
    {
      id: "",
      content: "..."
    }
  ]

  // 跨浏览器事件对象
  static EventUtil = {
    addEvent(element, type, handler) {
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
    removeEvent(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.datachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    },
    getEvent(event) {
      // 返回事件对象引用
      return event ? event : window.event;
    },
    // 获取mouseover和mouseout相关元素
    getRelatedTarget(event) {
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
    getTarget(event) {
      //返回事件源目标
      return event.target || event.srcElement;
    },
    preventDefault(event) {
      //取消默认事件
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    stoppropagation(event) {
      //阻止事件流
      if (event.stoppropagation) {
        event.stoppropagation();
      } else {
        event.canceBubble = false;
      }
    },
    // 获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
    getButton(event) {
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
    getWheelDelta(event) {
      if (event.wheelDelta) {
        return event.wheelDelta;
      } else {
        return -event.detail * 40;
      }
    },
    // 以跨浏览器取得相同的字符编码，需在keypress事件中使用
    getCharCode(event) {
      if (typeof event.charCode == "number") {
        return event.charCode;
      } else {
        return event.keyCode;
      }
    }
  }

  // 模仿jQuery $()
  $(selector, context) {
    context = arguments.length > 1 ? context : document;
    return context ? context.querySelectorAll(selector) : null;
  }

  getPageInfos (className, content) {
    return {
      id: "page",
      className: className,
      content: content
    };
  }

  changePage () {
    let pageElement = this.pageElement;
    EventUtil.addEvent(pageElement, "click", (ev) => {
      let e = ev || window.event;
      let target = e.target || e.srcElement;
      if (target.nodeName.toLocaleLowerCase() == "a") {
        if (target.id === "prev") {
          this.prevPage();
        } else if (target.id === "next") {
          this.nextPage();
        } else if (target.id === "first") {
          this.firstPage();
        } else if (target.id === "last") {
          this.lastPage();
        } else if (target.id === "page") {
          this.goPage(parseInt(target.innerHTML));
        } else {
          return;
        }
        this.renderPages();
        this.options.callback && this.options.callback({
          curr: this.pageNumber,
          limit: this.options.limit,
          isFirst: false
        });
        this.pageHash();
      }
    });
  }

  pageHash () {
    if (this.options.hash) {
      window.location.hash = '#!' + this.options.hash + '=' + this.pageNumber;
    }
  }

  renderPages () {
    this.pageElement.innerHTML = "";
    if (this.options.ellipsis) {
      this.pageElement.appendChild(this.renderEllipsis());
    } else {
      this.pageElement.appendChild(this.renderNoEllipsis());
    }
  }

  renderNoEllipsis () {
    let fragment = document.createDocumentFragment();
    if (this.pageNumber < this.options.pageShow + 1) {
      fragment.appendChild(this.renderDom(1, this.options.pageShow * 2 + 1));
    } else if (this.pageNumber > this.pageCount - this.options.pageShow) {
      fragment.appendChild(this.renderDom(this.pageCount - this.options.pageShow * 2, this.pageCount));
    } else {
      fragment.appendChild(this.renderDom(this.pageNumber - this.options.pageShow, this.pageNumber + this.options.pageShow));
    }
    if (this.pageNumber > 1) {
      this.addFragmentBefore(fragment, [
        Pagination.PageInfos[0],
        Pagination.PageInfos[1]
      ]);
    }
    if (this.pageNumber < this.pageCount) {
      this.addFragmentAfter(fragment, [Pagination.PageInfos[2], Pagination.PageInfos[3]]);
    }
    return fragment;
  }

  renderEllipsis () {
    let fragment = document.createDocumentFragment();
    this.addFragmentAfter(fragment, [
      this.getPageInfos(Pagination.CLASS_NAME.LINK + " current", this.pageNumber)
    ]);
    for (let i = 1; i <= this.options.pageShow; i++) {
      if (this.pageNumber - i > 1) {
        this.addFragmentBefore(fragment, [
          this.getPageInfos(Pagination.CLASS_NAME.LINK, this.pageNumber - i)
        ]);
      }
      if (this.pageNumber + i < this.pageCount) {
        this.addFragmentAfter(fragment, [
          this.getPageInfos(Pagination.CLASS_NAME.LINK, this.pageNumber + i)
        ]);
      }
    }
    if (this.pageNumber - (this.options.pageShow + 1) > 1) {
      this.addFragmentBefore(fragment, [Pagination.PageInfos[4]]);
    }
    if (this.pageNumber > 1) {
      this.addFragmentBefore(fragment, [
        Pagination.PageInfos[0],
        Pagination.PageInfos[1],
        this.getPageInfos(Pagination.CLASS_NAME.LINK, 1)
      ]);
    }
    if (this.pageNumber + this.options.pageShow + 1 < this.pageCount) {
      this.addFragmentAfter(fragment, [Pagination.PageInfos[4]]);
    }
    if (this.pageNumber < this.pageCount) {
      this.addFragmentAfter(fragment, [
        this.getPageInfos(Pagination.CLASS_NAME.LINK, this.pageCount),
        Pagination.PageInfos[2],
        Pagination.PageInfos[3]
      ]);
    }
    return fragment;
  }

  addFragmentBefore (fragment, datas) {
    fragment.insertBefore(this.createHtml(datas), fragment.firstChild);
  }

  addFragmentAfter (fragment, datas) {
    fragment.appendChild(this.createHtml(datas));
  }

  createHtml (elemDatas) {
    let fragment = document.createDocumentFragment();
    let liEle = document.createElement("li");
    let aEle = document.createElement("a");
    elemDatas.forEach((elementData, index) => {
      liEle = liEle.cloneNode(false);
      aEle = aEle.cloneNode(false);
      liEle.setAttribute("class", Pagination.CLASS_NAME.ITEM);
      aEle.setAttribute("href", "javascript:;");
      aEle.setAttribute("id", elementData.id);
      if (elementData.id !== 'page') {
        aEle.setAttribute("class", Pagination.CLASS_NAME.LINK);
      } else {
        aEle.setAttribute("class", elementData.className);
      }
      aEle.innerHTML = elementData.content;
      liEle.appendChild(aEle);
      fragment.appendChild(liEle);
    });
    return fragment;
  }

  renderDom (begin, end) {
    let fragment = document.createDocumentFragment();
    let str = "";
    for (let i = begin; i <= end; i++) {
      str = this.pageNumber === i ? Pagination.CLASS_NAME.LINK + " current" : Pagination.CLASS_NAME.LINK;
      this.addFragmentAfter(fragment, [this.getPageInfos(str, i)]);
    }
    return fragment;
  }

  prevPage () {
    this.pageNumber--;
  }

  nextPage () {
    this.pageNumber++;
  }

  goPage (pageNumber) {
    this.pageNumber = pageNumber;
  }

  firstPage () {
    this.pageNumber = 1;
  }

  lastPage () {
    this.pageNumber = this.pageCount;
  }

  init(selector) {
    // 分页器元素
    this.pageElement = this.$(selector)[0];
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
  }
}

export default Pagination;
