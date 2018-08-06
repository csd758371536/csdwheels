(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Carousel = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";

  // ID-NAMES
  var ID = {
    CAROUSEL: '#carousel',
    CAROUSEL_WRAP: '#carouselWrap',
    CAROUSEL_DOTS: '#carouselDots',
    ARROW_LEFT: '#arrowLeft',
    ARROW_RIGHT: '#arrowRight'
  };

  var CLASS = {
    CAROUSEL_IMG: 'carousel-image',
    CAROUSEL_DOTS_WRAP: 'carousel-buttons-wrap',
    CAROUSEL_DOTS: 'carousel-buttons',
    CAROUSEL_DOT: 'carousel-button',
    CAROUSEL_DOT_ON: 'carousel-button on',
    CAROUSEL_ARROW_LEFT: 'carousel-arrow arrow-left',
    CAROUSEL_ARROW_RIGHT: 'carousel-arrow arrow-right'
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

  // 合并对象
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  // 轮播-构造函数
  var Carousel = function (selector, userOptions) {
    // 初始化轮播
    this.initCarousel(selector, userOptions)
    // 初始化圆点
    this.initDots();
    // 初识化箭头
    this.initArrows();
  };
  // 轮播-原型对象
  Carousel.prototype = {
    carouselOptions: {
      carouselWidth: 600,
      carouselHeight: 400,
      showArrow: true,
      showDot: true,
      carouselTime: 2000,
      carouselMode: 'pc'
    },
    initCarousel: function(selector, userOptions) {
      // 合并配置
      extend(this.carouselOptions, userOptions, true);
      // 获取轮播属性
      this.getCarousel();
      // 设置轮播
      this.setCarousel();
      // 初始化轮播序号
      this.carouselIndex = 1;
      // 初始化定时器
      this.carouselTimer = null;
      // 绑定轮播图事件
      this.bindCarousel();
      // 播放轮播
      this.playCarousel();
    },
    getCarousel: function () {
      // 获取轮播元素
      this.carousel = document.querySelector(ID.CAROUSEL);
      this.carouselWrap = document.querySelector(ID.CAROUSEL_WRAP);
      // 获取轮播数量
      this.carouselCount = this.carouselWrap.children.length;
      // 初始化图片
      // this.carousel.appendChild(this.getImgs());
    },
    setCarousel: function () {
      var first = this.carouselWrap.children[0].cloneNode(true);
      var last = this.carouselWrap.children[this.carouselCount - 1].cloneNode(true);
      // 添加过渡元素
      this.carouselWrap.insertBefore(last, this.carouselWrap.children[0]);
      this.carouselWrap.appendChild(first);
      // 设置轮播宽度
      this.setCarouselWidth(this.carouselOptions.carouselWidth);
      // 设置轮播高度
      this.setCarouselHeight(this.carouselOptions.carouselHeight);
      // 获取轮播宽度
      this.carouselWidth = this.getCarouselWidth();
      // 设置初始位置
      this.setCarouselWrapLeft(-this.carouselWidth);
      // 设置轮播长度
      this.setCarouselWrapWidth(this.carouselWidth * this.carouselWrap.children.length);
    },
    setCarouselWidth: function (widthValue) {
      this.carousel.style.width = widthValue + 'px';
    },
    setCarouselHeight: function (heightValue) {
      this.carousel.style.height = heightValue + 'px';
    },
    getCarouselWidth: function () {
      return parseInt(this.carousel.style.width);
    },
    setCarouselWrapLeft: function (leftValue) {
      this.carouselWrap.style.left = leftValue + 'px';
    },
    getCarouselWrapLeft: function () {
      return parseInt(this.carouselWrap.style.left);
    },
    setCarouselWrapWidth: function (widthValue) {
      this.carouselWrap.style.width = widthValue + 'px';
    },
    getCarouselWrapWidth: function () {
      return parseInt(this.carouselWrap.style.width);
    },
    getImgs: function () {
      var fragment = document.createDocumentFragment();
      var imgEle = document.createElement("img");
      this.carouselOptions.carouselImages.forEach(function(carouselImage, index) {
        imgEle = imgEle.cloneNode(false);
        imgEle.setAttribute("class", CLASS.CAROUSEL_IMG);
        imgEle.setAttribute("src", carouselImage);
        imgEle.setAttribute("alt", index);
        fragment.appendChild(imgEle);
      });
      return fragment;
    },
    initArrows: function () {
      if (this.carouselOptions.showArrow) {
          // 初始化箭头
          this.carousel.appendChild(this.getArrows());
          // 获取箭头
          this.arrowLeft = document.querySelector(ID.ARROW_LEFT);
          this.arrowRight = document.querySelector(ID.ARROW_RIGHT);
          // 绑定箭头事件
          this.bindArrows();
      }
    },
    getArrows: function () {
      var fragment = document.createDocumentFragment();
      var arrowLeftEle = document.createElement("a");
      var arrowRightEle = document.createElement("a");
      arrowLeftEle.setAttribute("href", 'javascript:;');
      arrowLeftEle.setAttribute("class", CLASS.CAROUSEL_ARROW_LEFT);
      arrowLeftEle.setAttribute('id', ID.ARROW_LEFT.substring(1, ID.ARROW_LEFT.length));
      arrowLeftEle.innerHTML = '&lt;';
      arrowRightEle.setAttribute("href", 'javascript:;');
      arrowRightEle.setAttribute("class", CLASS.CAROUSEL_ARROW_RIGHT);
      arrowRightEle.setAttribute('id', ID.ARROW_RIGHT.substring(1, ID.ARROW_RIGHT.length));
      arrowRightEle.innerHTML = '&gt;';
      fragment.appendChild(arrowLeftEle);
      fragment.appendChild(arrowRightEle);
      return fragment;
    },
    initDots: function () {
      if (this.carouselOptions.showDot) {
        // 初始化圆点DOM
        this.carousel.appendChild(this.getDots());
        // 获取圆点
        this.carouselDots = document.querySelector(ID.CAROUSEL_DOTS);
        // 设置圆点位置
        this.setDot();
        // 绑定圆点事件
        this.bindDots();
      }
    },
    getDots: function () {
      var dotsWrap = document.createElement('div');
      dotsWrap.setAttribute('class', CLASS.CAROUSEL_DOTS_WRAP);
      var dots = document.createElement('div');
      dots.setAttribute('class', CLASS.CAROUSEL_DOTS);
      dots.setAttribute('id', ID.CAROUSEL_DOTS.substring(1, ID.CAROUSEL_DOTS.length));
      var fragment = document.createDocumentFragment();
      var spanEle = document.createElement("span");
      for (var i = 0, len = this.carouselCount; i < len; i++) {
        spanEle = spanEle.cloneNode(false);
        spanEle.setAttribute("class", CLASS.CAROUSEL_DOT);
        fragment.appendChild(spanEle);
      }
      dots.appendChild(fragment);
      dotsWrap.appendChild(dots);
      return dotsWrap;
    },
    bindDots: function () {
      var _this = this;
      for (var i = 0, len = this.carouselDots.children.length; i < len; i++) {
        (function(i) {
          addEvent(_this.carouselDots.children[i], 'click', function (ev) {
            // 获取圆点序号
            var dotIndex = i + 1;
            _this.setCarouselWrapLeft(-_this.carouselWidth * dotIndex);
            _this.carouselIndex = dotIndex;
            _this.setDot();
          });
        })(i);
      }
    },
    setDot: function () {
      for (var i = 0, len = this.carouselDots.children.length; i < len; i++) {
        this.carouselDots.children[i].setAttribute('class', CLASS.CAROUSEL_DOT);
      }
      this.carouselDots.children[this.carouselIndex - 1].setAttribute('class', CLASS.CAROUSEL_DOT_ON);
    },
    playCarousel: function () {
      var _this = this;
      this.carouselTimer = window.setInterval(function() {
        _this.nextCarousel();
      }, this.carouselOptions.carouselTime);
    },
    bindCarousel: function () {
      var _this = this;
      // 鼠标移入移出事件
      addEvent(this.carousel, 'mouseenter', function(e) {
        clearInterval(_this.carouselTimer);
      });
      addEvent(this.carousel, 'mouseleave', function(e) {
        _this.playCarousel();
      });
    },
    bindArrows: function () {
      var _this = this;
      // 箭头点击事件
      addEvent(this.arrowLeft, 'click', function(e) {
        _this.prevCarousel();
      });
      addEvent(this.arrowRight, 'click', function(e) {
        _this.nextCarousel();
      });
    },
    isFirstCarousel: function () {
      var left = 0;
      return this.getCarouselWrapLeft() === left ? true : false;
    },
    isLastCarousel: function () {
      var left = this.carouselWidth - this.getCarouselWrapWidth();
      return this.getCarouselWrapLeft() === left ? true : false;
    },
    prevCarousel: function () {
      // 改变轮播序号
      this.carouselIndex--;
      if (this.carouselIndex < 1) {
        this.carouselIndex = this.carouselCount;
      }
      // 设置轮播位置
      this.moveCarousel(this.isFirstCarousel(), this.carouselWidth);
      if (this.carouselOptions.showDot) {
        // 显示当前圆点
        this.setDot();
      }
    },
    nextCarousel: function () {
      this.carouselIndex++;
      if (this.carouselIndex > this.carouselCount) {
        this.carouselIndex = 1;
      }
      this.moveCarousel(this.isLastCarousel(), -this.carouselWidth);
      if (this.carouselOptions.showDot) {
        // 显示当前圆点
        this.setDot();
      }
    },
    moveCarousel: function (status, carouselWidth) {
      var left = 0;
      if (status) {
        left = -this.carouselIndex * this.carouselWidth;
      } else {
        left = this.getCarouselWrapLeft() + carouselWidth;
      }
      this.setCarouselWrapLeft(left);
    },
    constructor: Carousel
  };
  // 第一种 js动画
  // 第二种 css动画 transform .6s ease-in-out  translate3d(0,0,0)
  return Carousel;
});
