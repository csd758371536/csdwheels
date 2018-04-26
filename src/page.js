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

        /*
         * dataCount: 数据总数
         * pageSize: 每页最多显示的数据数量
         * pageMax: 界面最多能显示的页码数量
         */
        var Page = function(pageOption) {
            // 支持Page()或new Page()创建
            if (!(this instanceof Page)) return new Page();
            // 最多显示页码数
            this.pageMax = pageOption.pageMax;
            // 当前页码
            this.pageNumber = 1;
            // 总页数
            this.pageCount = Math.ceil(pageOption.dataCount / pageOption.pageSize);
            // 渲染
            this.renderPages();
            // 改变页码
            this.changePage();
        };
        Page.prototype = {
                construct: Page,
                bindEvent: function() {
                    if (this.pageEvent !== undefined) {
                        this.pageEvent();
                    }
                },
                changePage: function() {
                    var _this = this;
                    var pagelist = document.getElementById("pagelist");
                    this.addEvent(pagelist, 'click', function(ev) {
                        var e = ev || window.event;
                        var target = e.target || e.srcElement;
                        if (target.nodeName.toLocaleLowerCase() == 'a') {
                            if (target.id === 'prev') {
                                _this.prevPage();
                                _this.bindEvent();
                            } else if (target.id === 'next') {
                                _this.nextPage();
                                _this.bindEvent();
                            } else if (target.id === 'first') {
                                _this.firstPage();
                                _this.bindEvent();
                            } else if (target.id === 'last') {
                                _this.lastPage();
                                _this.bindEvent();
                            } else {
                                _this.goPage(parseInt(target.innerHTML));
                                _this.bindEvent();
                            }
                        }
                    });
                };
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
    // function showPages (page, pageCount) {
    //     var str = page + '';
    //     for (var i = 1; i <= 2; i++) {
    //         if (page - i > 1) {
    //             str = page - i + ' ' + str;
    //         }
    //         if (page + i < pageCount) {
    //             str = str + ' ' + (page + i);
    //         }
    //     }
    //     if (page - 3 > 1) {
    //         str = '... ' + str;
    //     }
    //     if (page > 1) {
    //         str = '上一页 ' + 1 + ' ' + str;
    //     }
    //     if (page + 3 < pageCount) {
    //         str = str + ' ...';
    //     }
    //     if (page < pageCount) {
    //         str = str + ' ' + pageCount + ' 下一页';
    //     }
    //     return str;
    // }

    // var pageCount = 50;
    // for (var i = 1; i <= pageCount; i++) {
    //     var ret = showPages(i, pageCount);
    //     console.log(ret);
    // }

    window.Page = Page;
})(window, document);