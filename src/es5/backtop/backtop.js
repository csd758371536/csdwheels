// 文章： 从几个常见属性讲起（offset scrollTop client）
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BackTop = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Polyfills
  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  }

  // 获取滚动条距顶部的距离
  function getScrollTop() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  // 设置滚动条距顶部的距离
  function setScrollTop(value) {
    window.pageYOffset = document.documentElement.scrollTop = document.body.scrollTop = value;
  }

  // 获取窗口高度
  function getClientHeight() {
    return (
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    );
  }

  var BackTop = function(selector) {
    // 初始化属性
    this.initBackTop(selector);
    // 绑定点击事件
    this.bindBackTop();
  };
  BackTop.prototype = {
    initBackTop: function(selector) {
      // 初始化定时器
      this.scrollTimer = null;
      // 判断是否到顶部
      this.isTop = true;
      // 判断是否显示按钮
      this.isShowScroll = false;
      // 滚动间隔
      this.scrollInterval = 30;
      // 滚动步长
      this.scrollStep = 5;
      // 获取按钮元素
      this.backTop = document.querySelector(selector);
      // 绑定滚动事件
      this.bindScroll();
    },
    bindBackTop: function() {
      var _this = this;
      addEvent(this.backTop, 'click', function(e) {
        if (_this.scrollTimer) {
          clearInterval(_this.scrollTimer);
        }
        _this.scrollTimer = setInterval(function() {
          var osTop = getScrollTop();
          var ispeed = Math.floor(-osTop / _this.scrollStep);
          setScrollTop(osTop + ispeed);
          _this.isTop = true;
          if (osTop === 0) {
            clearInterval(_this.scrollTimer);
          }
        }, _this.scrollInterval);
      });
    },
    bindScroll: function() {
      var _this = this;
      addEvent(window, 'scroll', function(e) {
        if (getScrollTop() >= getClientHeight()) {
          _this.isShowScroll = true;
        } else {
          _this.isShowScroll = false;
        }
        if (!_this.isTop) {
          clearInterval(_this.scrollTimer);
        }
        _this.isTop = false;
      });
    },
    constructor: BackTop,
  };

  return BackTop;
});
