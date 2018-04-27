(function(window, document, undefined) {
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
        // 合并默认配置
        option = extend(true, this.defaultOption, option)
        // 最多显示页码数
        this.pageMax = option.pageMax;
        // 当前页码
        this.pageNumber = 1;
        // 总页数
        this.pageCount = Math.ceil(option.dataCount / option.pageSize);
        // 事件
        this.pageEvent = option.pageEvent;
        // 渲染
        this.renderPages();
        // 改变页码
        this.changePage();
    };

    Page.prototype = {
        construct: Page,
        // 默认配置
        defaultOption: {
          dataCount: 162,
          pageSize: 7,
          pageMax: 5,
          pageType: 'normal',
          pageEvent: function() {}
        },
        changePage: function() {
            var _this = this;
            var pagelist = document.getElementById("pagelist");
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
                    } else {
                        _this.goPage(parseInt(target.innerHTML));
                    }
                    _this.pageEvent();
                }
            });
        },
        renderPages: function() {
            var html = "",
                count;
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
            document.getElementById('pagelist').innerHTML = html;
        },
        renderFirst: function() {
            return this.renderDom(1, this.pageMax);
        },
        renderLast: function() {
            return this.renderDom(this.pageCount - this.pageMax + 1, this.pageCount);
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

    // test

    // 第二种：显示首页和最后一页页码、每一页前后最多显示2个页码
    function showPages (page, pageCount) {
        var str = page + '';
        for (var i = 1; i <= 2; i++) {
            if (page - i > 1) {
                str = page - i + ' ' + str;
            }
            if (page + i < pageCount) {
                str = str + ' ' + (page + i);
            }
        }
        if (page - 3 > 1) {
            str = '... ' + str;
        }
        if (page > 1) {
            str = '上一页 ' + 1 + ' ' + str;
        }
        if (page + 3 < pageCount) {
            str = str + ' ...';
        }
        if (page < pageCount) {
            str = str + ' ' + pageCount + ' 下一页';
        }
        return str;
    }

    var pageCount = 50;
    for (var i = 1; i <= pageCount; i++) {
        var ret = showPages(i, pageCount);
        console.log(ret);
    }

    window.Page = Page;
})(window, document);