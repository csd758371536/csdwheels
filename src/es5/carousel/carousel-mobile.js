(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CarouselMobile = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // ID-NAMES
  var ID = {
    CAROUSEL_WRAP: "#carouselWrap"
  };

  var CLASS = {
    CAROUSEL_WRAP: "carousel-wrap",
    CAROUSEL_IMG: "carousel-image"
  };

  // Polyfills
  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  }

  function stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }

  // 合并对象
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  // 轮播-构造函数
  var CarouselMobile = function(selector, userOptions) {
    var _this = this;
    // 合并配置
    extend(this.carouselOptions, userOptions, true);
    // 获取轮播元素
    _this.carousel = document.querySelector(selector);
    // 初始化轮播列表
    _this.carousel.appendChild(_this.getImgs());
    // 获取轮播列表
    _this.carouselWrap = document.querySelector(ID.CAROUSEL_WRAP);
    // 每隔 50ms 检测一次轮播是否加载完成
    var checkInterval = 50;
    var checkTimer = setInterval(function() {
      // 检测轮播是否加载完成
      if (_this.isCarouselComplete()) {
        // 加载完成后清除定时器
        clearInterval(checkTimer);
        // 初始化轮播
        _this.initCarousel();
      }
    }, checkInterval);
  };
  // 轮播-原型对象
  CarouselMobile.prototype = {
    carouselOptions: {
      carouselTime: 3000
    },
    isCarouselComplete: function() {
      // 检测页面图片是否加载完成
      var completeCount = 0;
      for (var i = 0; i < this.carouselWrap.children.length; i++) {
        if (this.carouselWrap.children[i].complete) {
          completeCount++;
        }
      }
      return completeCount === this.carouselWrap.children.length ? true : false;
    },
    initCarousel: function(selector, userOptions) {
      // 获取轮播数量
      this.carouselCount = this.carouselWrap.children.length;
      // 设置轮播
      this.setCarousel();
      // 初始化轮播序号
      this.carouselIndex = 1;
      // 初始化定时器
      this.carouselTimer = null;
      // 轮播一次滑动的时间
      this.carouselDuration = 300;
      // 判断是否处于轮播动画状态
      this.isCarouselAnimate = false;
      this.t = {
        sx: 0,
        s: 0,
        m: 0,
        e: 0
      };
      // 绑定轮播图事件
      this.bindCarousel();
      // 播放轮播
      this.playCarousel();
    },
    setCarousel: function() {
      var _this = this;
      // 复制首尾节点
      var first = _this.carouselWrap.children[0].cloneNode(true);
      var last = _this.carouselWrap.children[_this.carouselCount - 1].cloneNode(
        true
      );
      // 添加过渡元素
      _this.carouselWrap.insertBefore(last, _this.carouselWrap.children[0]);
      _this.carouselWrap.appendChild(first);
      // 获取轮播宽度
      _this.carouselWidth = _this.getCarouselWidth();
      // 设置初始位置
      _this.setTransform(_this.carouselWrap, -_this.carouselWidth);
    },
    getCarouselWidth: function() {
      return parseInt(this.carousel.offsetWidth);
    },
    setTransform: function(elem ,value) {
      elem.style.transform =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-webkit-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-ms-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
    },
    getTransform: function() {
      var x =
        this.carouselWrap.style.transform ||
        this.carouselWrap.style["-webkit-transform"] ||
        this.carouselWrap.style["-ms-transform"];
      x = x.substring(12);
      x = x.match(/(\S*)px/)[1];
      return Number(x);
    },
    getImgs: function() {
      var carouselWrapEle = document.createElement("div");
      carouselWrapEle.setAttribute("class", CLASS.CAROUSEL_WRAP);
      carouselWrapEle.setAttribute(
        "id",
        ID.CAROUSEL_WRAP.substring(1, ID.CAROUSEL_WRAP.length)
      );
      var fragment = document.createDocumentFragment();
      var imgEle = document.createElement("img");
      this.carouselOptions.carouselImages.forEach(function(
        carouselImage,
        index
      ) {
        imgEle = imgEle.cloneNode(false);
        imgEle.setAttribute("class", CLASS.CAROUSEL_IMG);
        imgEle.setAttribute("src", carouselImage);
        imgEle.setAttribute("alt", index + 1);
        fragment.appendChild(imgEle);
      });
      carouselWrapEle.appendChild(fragment);
      return carouselWrapEle;
    },
    playCarousel: function() {
      var _this = this;
      this.carouselTimer = window.setInterval(function() {
        _this.nextCarousel();
      }, this.carouselOptions.carouselTime);
    },
    bindCarousel: function() {
      var _this = this;
      // 鼠标移入移出事件
      addEvent(this.carousel, "touchstart", function(e) {
        if (!_this.isCarouselAnimate) {
          clearInterval(_this.carouselTimer);
          _this.t.sx = _this.getTransform();
          _this.t.s = e.changedTouches[e.changedTouches.length - 1].clientX;
        }
      });
      addEvent(this.carousel, "touchmove", function(e) {
        if (!_this.isCarouselAnimate && _this.t.s != -1) {
          clearInterval(_this.carouselTimer);
          _this.t.m =
            e.changedTouches[e.changedTouches.length - 1].clientX - _this.t.s;
          _this.setTransform(_this.carouselWrap, _this.t.m + _this.t.sx);
        }
      });
      addEvent(this.carousel, "touchend", function(e) {
        if (!_this.isCarouselAnimate && _this.t.s != -1) {
          clearInterval(_this.carouselTimer);
          _this.setTransform(_this.carouselWrap, _this.t.m + _this.t.sx);
          var x = _this.getTransform();
          x +=
            _this.t.m > 0
              ? _this.carouselWidth * 0.3
              : _this.carouselWidth * -0.3;
          _this.carouselIndex = Math.round(x / _this.carouselWidth) * -1;
          _this.moveCarousel(
            _this.carouselIndex * -_this.carouselWidth
          );
          if (_this.carouselIndex > _this.carouselCount) {
            _this.carouselIndex = 1;
          }
          if (_this.carouselIndex < 1) {
            _this.carouselIndex = _this.carouselCount;
          }
          _this.playCarousel();
        }
      });
    },
    nextCarousel: function() {
      if (!this.isCarouselAnimate) {
        this.carouselIndex++;
        if (this.carouselIndex > this.carouselCount) {
          this.carouselIndex = 1;
        }
        this.moveCarousel(
          this.getTransform() - this.carouselWidth
        );
      }
    },
    moveCarousel: function(target) {
      var _this = this;
      _this.isCarouselAnimate = true;
      this.carouselWrap.style.transition = "350ms";
      _this.setTransform(_this.carouselWrap, target);
      _this.resetCarousel(target);
    },
    resetCarousel: function(target) {
      var _this = this;
      window.setTimeout(function() {
        // 重置箭头或者自动轮播后的状态
        _this.resetMoveCarousel(target);
        _this.isCarouselAnimate = false;
      }, _this.carouselDuration);
    },
    resetMoveCarousel: function(target) {
      this.carouselWrap.style.transition = "0s";
      // 不符合位移条件，把当前left值置为目标值
      this.setTransform(this.carouselWrap, target);
      //如当前在辅助图上，就归位到真的图上
      if (target > -this.carouselWidth) {
        this.setTransform(this.carouselWrap, -this.carouselCount * this.carouselWidth);
      }
      if (target < -this.carouselWidth * this.carouselCount) {
        this.setTransform(this.carouselWrap, -this.carouselWidth);
      }
    },
    constructor: CarouselMobile
  };
  return CarouselMobile;
});
