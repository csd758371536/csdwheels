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
    CAROUSEL_DOT: 'carousel-button',
    CAROUSEL_DOT_ON: 'carousel-button on',
    CAROUSEL_ARROW_LEFT: 'carousel-arrow arrow-left',
    CAROUSEL_ARROW_LEFT_SHOW: 'carousel-arrow arrow-left show',
    CAROUSEL_ARROW_RIGHT: 'carousel-arrow arrow-right',
    CAROUSEL_ARROW_RIGHT_SHOW: 'carousel-arrow arrow-right show',
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
    this.initCarousel(selector, userOptions)
  };
  // 轮播-原型对象
  Carousel.prototype = {
    carouselOptions: {
      showArrow: true,
      showDot: true,
      carouselTime: 2000,
      carouselMode: 'pc',
      carouselImages: []
    },
    initCarousel: function(selector, userOptions) {
      // 合并配置
      extend(this.carouselOptions, userOptions, true);
      // 获取DOM
      this.carousel = document.querySelector(ID.CAROUSEL);
      this.carouselWrap = document.querySelector(ID.CAROUSEL_WRAP);
      this.arrowLeft = document.querySelector(ID.ARROW_LEFT);
      this.arrowRight = document.querySelector(ID.ARROW_RIGHT);
      // 初始化图片DOM
      this.carouselWrap.appendChild(this.initImgs());
      // 增加过渡DOM
      var first = this.carouselWrap.children[0].cloneNode(true);
      var last = this.carouselWrap.children[this.carouselWrap.children.length - 1].cloneNode(true);
      this.carouselWrap.insertBefore(last, this.carouselWrap.firstChild);
      this.carouselWrap.appendChild(first);
      // 初始化轮播序号
      this.carouselIndex = 0;
      // 初始化定时器
      this.carouselTimer = null;
      // 绑定轮播图事件
      this.bindCarousel();
      // 播放轮播
      this.playCarousel();
      // 初始化小圆点
      this.initDots();
    },
    initImgs: function () {
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
    initDom: function (parentNode, nodeType, className, nodeInfos) {

    },
    initDots: function () {
      if (this.carouselOptions.showDot) {
        // 初始化小圆点DOM
        // this.initDom();
        // 获取小圆点
        this.carouselDots = document.querySelector(ID.CAROUSEL_DOTS);
        this.showCurrentDot();
        this.bindDots();
      }
    },
    bindDots: function () {
      var _this = this;
      addEvent(this.carouselDots, 'click', function (ev) {
        var e = ev || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLocaleLowerCase() == 'span') {
          var dotIndex = parseInt(target.innerHTML) - 1;
          var dis = _this.carouselIndex - dotIndex;
          if (_this.carouselIndex === 4 && parseInt(_this.carouselWrap.style.left) !== -3000) {
            dis = dis - 5;
          }
          //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
          if (_this.carouselIndex === 0 && parseInt(_this.carouselWrap.style.left) !== -600) {
            dis = 5 + dis;
          }
          _this.carouselWrap.style.left = parseInt(_this.carouselWrap.style.left) + dis * 600 + 'px';
          _this.carouselIndex = dotIndex;
        }
        _this.showCurrentDot();
      });
    },
    showCurrentDot: function () {
      for (var i = 0, len = this.carouselDots.children.length; i < len; i++) {
        this.carouselDots.children[i].setAttribute('class', CLASS.CAROUSEL_DOT);
      }
      this.carouselDots.children[this.carouselIndex].setAttribute('class', CLASS.CAROUSEL_DOT_ON);
    },
    playCarousel: function () {
      var _this = this;
      this.carouselTimer = window.setInterval(function() {
        _this.nextCarousel();
      }, this.carouselOptions.carouselTime);
    },
    bindCarousel: function () {
      var _this = this;
      // 箭头点击事件
      addEvent(this.arrowLeft, 'click', function(e) {
        _this.prevCarousel();
      });
      addEvent(this.arrowRight, 'click', function(e) {
        _this.nextCarousel();
      });
      // 鼠标移入移出事件
      addEvent(this.carousel, 'mouseenter', function(e) {
        clearInterval(_this.carouselTimer);
      });
      addEvent(this.carousel, 'mouseleave', function(e) {
        _this.playCarousel();
      });
    },
    prevCarousel: function () {
      this.carouselIndex--;
      if (this.carouselIndex < 0) {
        this.carouselIndex = 4;
      }
      this.showCurrentDot();
      var newLeft = 0;
      if (this.carouselWrap.style.left === '0px') {
        newLeft = -2400;
      } else {
        newLeft = parseInt(this.carouselWrap.style.left) + 600;
      }
      this.carouselWrap.style.left = newLeft + 'px';
    },
    nextCarousel: function () {
      this.carouselIndex++;
      if (this.carouselIndex > 4) {
        this.carouselIndex = 0;
      }
      this.showCurrentDot();
      var newLeft = 0;
      if (this.carouselWrap.style.left === '-3600px') {
        newLeft = -1200;
      } else {
        newLeft = parseInt(this.carouselWrap.style.left) - 600;
      }
      this.carouselWrap.style.left = newLeft + 'px';
    },
    constructor: Carousel
  };


  // 第一种 js动画
  // 第二种 css动画 transform .6s ease-in-out  translate3d(0,0,0)

  // var wrap = document.querySelector(".wrap");
  // var next = document.querySelector(".arrow-right");
  // var prev = document.querySelector(".arrow-left");
  // next.onclick = function() {
  //   next_pic();
  // };
  // prev.onclick = function() {
  //   prev_pic();
  // };
  //
  // function next_pic() {
  //   index++;
  //   if (index > 4) {
  //     index = 0;
  //   }
  //   showCurrentDot();
  //   var newLeft;
  //   if (wrap.style.left === "-3600px") {
  //     newLeft = -1200;
  //   } else {
  //     newLeft = parseInt(wrap.style.left) - 600;
  //   }
  //   wrap.style.left = newLeft + "px";
  // }
  //
  // function prev_pic() {
  //   index--;
  //   if (index < 0) {
  //     index = 4;
  //   }
  //   showCurrentDot();
  //   var newLeft;
  //   if (wrap.style.left === "0px") {
  //     newLeft = -2400;
  //   } else {
  //     newLeft = parseInt(wrap.style.left) + 600;
  //   }
  //   wrap.style.left = newLeft + "px";
  // }
  // var timer = null;
  //
  // function autoPlay() {
  //   timer = setInterval(function() {
  //     next_pic();
  //   }, 2000);
  // }
  // autoPlay();
  // var container = document.querySelector(".container");
  // container.onmouseenter = function() {
  //   clearInterval(timer);
  // };
  // container.onmouseleave = function() {
  //   autoPlay();
  // };
  // var index = 0;
  // var dots = document.getElementsByTagName("span");
  //
  // function showCurrentDot() {
  //   for (var i = 0, len = dots.length; i < len; i++) {
  //     dots[i].className = "";
  //   }
  //   dots[index].className = "on";
  // }
  // for (var i = 0, len = dots.length; i < len; i++) {
  //   (function(i) {
  //     dots[i].onclick = function() {
  //       var dis = index - i;
  //       if (index == 4 && parseInt(wrap.style.left) !== -3000) {
  //         dis = dis - 5;
  //       }
  //       //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
  //       if (index == 0 && parseInt(wrap.style.left) !== -600) {
  //         dis = 5 + dis;
  //       }
  //       wrap.style.left = parseInt(wrap.style.left) + dis * 600 + "px";
  //       index = i;
  //       showCurrentDot();
  //     };
  //   })(i);
  // }
  return Carousel;
});
