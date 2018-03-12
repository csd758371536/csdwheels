;(function(window, document, undefined) {
  'use strict';
  var Page = function() {
    if (!(this instanceof Page)) return new Page();
    this.init();
  };
  Page.prototype = {
    construct: Page,
    init: function () {

    }
  };

  // test
  function showPages (page, total) {
    var str = '';
    // 求出所有页码
    var pageIndexs = [];
    var maxPageLink = 5;
    for (var i = 1; i < total + 1; i++) {
      pageIndexs.push(i);
    }
    if (page < (maxPageLink + 1) / 2) {
      pageIndexs = pageIndexs.slice(0, maxPageLink);
    } else if (total - page < (maxPageLink - 1) / 2) {
      pageIndexs = pageIndexs.slice(total - maxPageLink, total);
    } else {
      pageIndexs = pageIndexs.slice(page - (maxPageLink + 1) / 2,
      page + (maxPageLink - 1) / 2);
    }
    for (var i = pageIndexs.length - 1; i > -1; i--) {
      str = pageIndexs[i] + ' ' + str;
    }
    if (page > 1) {
        str = '上一页 ' + ' ' + str;
    }
    if (page < total) {
        str = str + ' ' + ' 下一页';
    }
    return str;
  }

  // function showPages (page, total) {
  //     var str = page + '';
  //     for (var i = 1; i <= 3; i++) {
  //         if (page - i > 1) {
  //             str = page - i + ' ' + str;
  //         }
  //         if (page + i < total) {
  //             str = str + ' ' + (page + i);
  //         }
  //     }
  //     if (page - 4 > 1) {
  //         str = '... ' + str;
  //     }
  //     if (page > 1) {
  //         str = '上一页 ' + 1 + ' ' + str;
  //     }
  //     if (page + 4 < total) {
  //         str = str + ' ...';
  //     }
  //     if (page < total) {
  //         str = str + ' ' + total + ' 下一页';
  //     }
  //     return str;
  // }
  var total = 110;
  for (var i = 1; i <= total; i++) {
      var ret = showPages(i, total);
      console.log(ret);
  }

  window.Page = Page;
})(window, document);
