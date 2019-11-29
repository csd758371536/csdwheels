(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Magnifier = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  var CLASS = {
    MAGNIFIER_SMALL: 'magnifier-small',
    MAGNIFIER_MASK: 'magnifier-mask',
    MAGNIFIER_BIG: 'magnifier-big',
    MAGNIFIER_BIG_IMG: 'magnifier-big-img',
  };

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

  // 合并对象
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  var Magnifier = function(selector, userOptions) {
    // 合并配置
    extend(this.magnifierOptions, userOptions, true);
    // 初始化
    this.initMagnifier(selector);
    // 绑定事件
    this.bindMagnifier();
  };
  Magnifier.prototype = {
    magnifierOptions: {},
    initMagnifier: function(selector) {
      this.magnifier = document.querySelector(selector);
      this.setMagnifier();
      this.setElemWidth(
        this.magnifierSmall,
        this.magnifierOptions.smallImgWidth,
      );
      this.setElemHeight(
        this.magnifierSmall,
        this.magnifierOptions.smallImgHeight,
      );
      this.setElemWidth(this.magnifierBig, this.magnifierOptions.bigImgWidth);
      this.setElemHeight(this.magnifierBig, this.magnifierOptions.bigImgHeight);
      this.magnifierSmallMaskLeft = 0;
      this.magnifierSmallMaskTop = 0;
    },
    setMagnifier: function() {
      this.magnifierSmall = document.createElement('div');
      this.magnifierSmall.setAttribute('class', CLASS.MAGNIFIER_SMALL);
      this.magnifierSmallImg = document.createElement('img');
      this.magnifierSmallImg.setAttribute(
        'src',
        this.magnifierOptions.smallImgSrc,
      );
      this.magnifierSmallMask = document.createElement('div');
      this.magnifierSmallMask.setAttribute('class', CLASS.MAGNIFIER_MASK);
      this.magnifierSmall.appendChild(this.magnifierSmallImg);
      this.magnifierSmall.appendChild(this.magnifierSmallMask);
      this.magnifierBig = document.createElement('div');
      this.magnifierBig.setAttribute('class', CLASS.MAGNIFIER_BIG);
      this.magnifierBigImg = document.createElement('img');
      this.magnifierBigImg.setAttribute('class', CLASS.MAGNIFIER_BIG_IMG);
      this.magnifierBigImg.setAttribute('src', this.magnifierOptions.bigImgSrc);
      this.magnifierBig.appendChild(this.magnifierBigImg);
      this.magnifier.appendChild(this.magnifierSmall);
      this.magnifier.appendChild(this.magnifierBig);
    },
    bindMagnifier: function() {
      var _this = this;
      addEvent(this.magnifierSmall, 'mouseover', function(e) {
        _this.setElemDisplay(_this.magnifierSmallMask, 'block');
        _this.setElemDisplay(_this.magnifierBig, 'block');
      });
      addEvent(this.magnifierSmall, 'mouseout', function(e) {
        _this.setElemDisplay(_this.magnifierSmallMask, 'none');
        _this.setElemDisplay(_this.magnifierBig, 'none');
      });
      addEvent(this.magnifierSmall, 'mousemove', function(e) {
        _this.getMaskPosition(e);
        _this.setMaskPosition();
        _this.setImgPosition();
      });
    },
    setElemWidth: function(elem, width) {
      elem.style.width = width + 'px';
    },
    setElemHeight: function(elem, height) {
      elem.style.height = height + 'px';
    },
    setElemDisplay: function(elem, type) {
      elem.style.display = type;
    },
    setElemLeft: function(elem, left) {
      elem.style.left = left + 'px';
    },
    setElemTop: function(elem, top) {
      elem.style.top = top + 'px';
    },
    getMaskPosition: function(event) {
      var event = event || window.event;
      this.magnifierSmallMaskLeft =
        event.clientX -
        this.magnifier.offsetLeft -
        this.magnifierSmallMask.offsetWidth / 2;
      this.magnifierSmallMaskTop =
        event.clientY -
        this.magnifier.offsetTop -
        this.magnifierSmallMask.offsetHeight / 2;
      if (this.magnifierSmallMaskLeft < 0) {
        this.magnifierSmallMaskLeft = 0;
      }
      if (
        this.magnifierSmallMaskLeft >
        this.magnifierSmall.offsetWidth - this.magnifierSmallMask.offsetWidth
      ) {
        this.magnifierSmallMaskLeft =
          this.magnifierSmall.offsetWidth - this.magnifierSmallMask.offsetWidth;
      }
      if (this.magnifierSmallMaskTop < 0) {
        this.magnifierSmallMaskTop = 0;
      }
      if (
        this.magnifierSmallMaskTop >
        this.magnifierSmall.offsetHeight - this.magnifierSmallMask.offsetHeight
      ) {
        this.magnifierSmallMaskTop =
          this.magnifierSmall.offsetHeight -
          this.magnifierSmallMask.offsetHeight;
      }
    },
    setMaskPosition: function() {
      this.setElemLeft(this.magnifierSmallMask, this.magnifierSmallMaskLeft);
      this.setElemTop(this.magnifierSmallMask, this.magnifierSmallMaskTop);
    },
    setImgPosition: function() {
      this.setElemLeft(
        this.magnifierBigImg,
        (-this.magnifierSmallMaskLeft * this.magnifierBig.offsetWidth) /
          this.magnifierSmall.offsetWidth,
      );
      this.setElemTop(
        this.magnifierBigImg,
        (-this.magnifierSmallMaskTop * this.magnifierBig.offsetHeight) /
          this.magnifierSmall.offsetHeight,
      );
    },
    constructor: Magnifier,
  };

  return Magnifier;
});
