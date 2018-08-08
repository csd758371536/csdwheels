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

  // 第一种 js动画
  // 第二种 css动画 transform .6s ease-in-out  translate3d(0,0,0)

  // ID-NAMES
  var ID = {
    CAROUSEL_WRAP: '#carouselWrap',
    CAROUSEL_DOTS: '#carouselDots',
    ARROW_LEFT: '#arrowLeft',
    ARROW_RIGHT: '#arrowRight'
  };

  var CLASS = {
    CAROUSEL_WRAP: 'carousel-wrap',
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

  // 交换DOM位置
  function swapNodes(a, b) {
    var aparent = a.parentNode;
    var asibling = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
  }

  // 轮播-构造函数
  var Carousel = function (selector, userOptions) {
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
    var checkTimer = setInterval(function () {
      // 检测轮播是否加载完成
      if (_this.isCarouselComplete()) {
        // 加载完成后清除定时器
        clearInterval(checkTimer);
        // 初始化轮播
        _this.initCarousel();
        // 初始化圆点
        _this.initDots();
        // 初识化箭头
        _this.initArrows();
      }
    }, checkInterval);
  };
  // 轮播-原型对象
  Carousel.prototype = {
    carouselOptions: {
      carouselWidth: 600,
      carouselHeight: 400,
      showArrow: true,
      showDot: true,
      carouselTime: 3000,
      carouselMode: 'pc'
    },
    isCarouselComplete: function () {
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
      // 轮播动画总时间
      this.carouselAnimateTime = 200;
      // 轮播动画间隔
      this.carouselAnimateInterval = 10;
      // 每次位移量 = 总偏移量 / 次数
      this.carouselAnimateSpeed = this.carouselWidth / (this.carouselAnimateTime / this.carouselAnimateInterval);
      // 判断是否处于轮播动画状态
      this.isCarouselAnimate = false;
      // 判断圆点是否点击
      this.isDotClick = false;
      // 绑定轮播图事件
      this.bindCarousel();
      // 播放轮播
      this.playCarousel();
    },
    setCarousel: function () {
      var _this = this;
      // 复制首尾节点
      var first = _this.carouselWrap.children[0].cloneNode(true);
      var last = _this.carouselWrap.children[_this.carouselCount - 1].cloneNode(true);
      // 添加过渡元素
      _this.carouselWrap.insertBefore(last, _this.carouselWrap.children[0]);
      _this.carouselWrap.appendChild(first);
      // 设置轮播宽度
      _this.setCarouselWidth(_this.carouselOptions.carouselWidth);
      // 设置轮播高度
      _this.setCarouselHeight(_this.carouselOptions.carouselHeight);
      // 获取轮播宽度
      _this.carouselWidth = _this.getCarouselWidth();
      // 设置初始位置
      _this.setCarouselWrapLeft(-_this.carouselWidth);
      // 设置轮播长度
      _this.setCarouselWrapWidth(_this.carouselWidth * _this.carouselWrap.children.length);
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
      var carouselWrapEle = document.createElement("div");
      carouselWrapEle.setAttribute("class", CLASS.CAROUSEL_WRAP);
      carouselWrapEle.setAttribute('id', ID.CAROUSEL_WRAP.substring(1, ID.CAROUSEL_WRAP.length));
      var fragment = document.createDocumentFragment();
      var imgEle = document.createElement("img");
      this.carouselOptions.carouselImages.forEach(function(carouselImage, index) {
        imgEle = imgEle.cloneNode(false);
        imgEle.setAttribute("class", CLASS.CAROUSEL_IMG);
        imgEle.setAttribute("src", carouselImage);
        imgEle.setAttribute("alt", index + 1);
        fragment.appendChild(imgEle);
      });
      carouselWrapEle.appendChild(fragment);
      return carouselWrapEle;
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
            if (!_this.isCarouselAnimate) {
              // 改变圆点点击状态
              _this.isDotClick = true;
              // 获取点击的圆点序号
              _this.dotIndex = i + 1;
              // 改变圆点位置
              _this.moveDot();
              // _this.setCarouselWrapLeft(-_this.carouselWidth * dotIndex);
              // _this.carouselIndex = _this.dotIndex;
              // _this.setDot();
            }
          });
        })(i);
      }
    },
    moveDot: function () {
      this.changeCarousel();
      this.carouselIndex = this.dotIndex;
      this.setDot();
    },
    changeCarousel: function () {
      // 保存当前节点位置
      this.currentNode = this.carouselWrap.children[this.carouselIndex];
      // 获取目标节点位置
      var targetNode = this.carouselWrap.children[this.dotIndex];
      // 判断点击圆点与当前的相对位置
      if (this.carouselIndex < this.dotIndex) {
        // 在当前元素右边插入目标节点
        var nextNode = this.currentNode.nextElementSibling;
        this.carouselWrap.insertBefore(targetNode.cloneNode(true), nextNode);
        this.moveCarousel(this.getCarouselWrapLeft() - this.carouselWidth, -this.carouselAnimateSpeed);
      }
      if (this.carouselIndex > this.dotIndex) {
        // _this.moveCarousel(-_this.carouselWidth * dotIndex, _this.carouselAnimateSpeed * 2);
        // 在当前元素左边插入目标节点
        this.carouselWrap.insertBefore(targetNode.cloneNode(true), this.currentNode);
        // 因为向左边插入节点后，当前元素的位置被改变，导致画面有抖动现象，这里重置为新的位置
        this.setCarouselWrapLeft(-(this.carouselIndex + 1) * this.carouselWidth);
        this.moveCarousel(this.getCarouselWrapLeft() + this.carouselWidth, this.carouselAnimateSpeed);
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
      if (!this.isCarouselAnimate) {
        // 改变轮播序号
        this.carouselIndex--;
        if (this.carouselIndex < 1) {
          this.carouselIndex = this.carouselCount;
        }
        // 设置轮播位置
        // this.moveCarousel(this.isFirstCarousel(), this.carouselWidth);
        this.moveCarousel(this.getCarouselWrapLeft() + this.carouselWidth, this.carouselAnimateSpeed);
        if (this.carouselOptions.showDot) {
          // 显示当前圆点
          this.setDot();
        }
      }
    },
    nextCarousel: function () {
      if (!this.isCarouselAnimate) {
        this.carouselIndex++;
        if (this.carouselIndex > this.carouselCount) {
          this.carouselIndex = 1;
        }
        // this.moveCarousel(this.isLastCarousel(), -this.carouselWidth);
        this.moveCarousel(this.getCarouselWrapLeft() - this.carouselWidth,  -this.carouselAnimateSpeed);
        if (this.carouselOptions.showDot) {
          // 显示当前圆点
          this.setDot();
        }
      }
    },
    moveCarousel: function (target, speed) {
      var _this = this;
      _this.isCarouselAnimate = true;
      function animateCarousel () {
        if ((speed > 0 && _this.getCarouselWrapLeft() < target) ||
            (speed < 0 && _this.getCarouselWrapLeft() > target)) {
          _this.setCarouselWrapLeft(_this.getCarouselWrapLeft() + speed);
          window.setTimeout(animateCarousel, _this.carouselAnimateInterval);
        } else {
          // 重置轮播状态
          _this.resetCarousel(target, speed);
        }
      }
      animateCarousel();
    },
    resetCarousel: function (target, speed) {
      // 判断圆点是否点击
      if (this.isDotClick) {
        // 重置圆点点击后的状态
        this.resetMoveDot(speed);
      } else {
        // 重置箭头或者自动轮播后的状态
        this.resetMoveCarousel(target);
      }
      this.isDotClick = false;
      this.isCarouselAnimate = false;
    },
    resetMoveDot: function (speed) {
      // 如果是圆点点击触发动画，需要删除新增的过度节点并将轮播位置重置到实际位置
      this.setCarouselWrapLeft(-this.dotIndex * this.carouselWidth);
      // 判断点击圆点和当前圆点的相对位置
      if (speed < 0) {
        this.carouselWrap.removeChild(this.currentNode.nextElementSibling);
      } else {
        this.carouselWrap.removeChild(this.currentNode.previousElementSibling);
      }
    },
    resetMoveCarousel: function (target) {
      // 不符合位移条件，把当前left值置为目标值
      this.setCarouselWrapLeft(target);
      //如当前在辅助图上，就归位到真的图上
      if (target > -this.carouselWidth ) {
        this.setCarouselWrapLeft(-this.carouselCount * this.carouselWidth);
      }
      if (target < (-this.carouselWidth * this.carouselCount)) {
        this.setCarouselWrapLeft(-this.carouselWidth);
      }
    },
    // moveCarousel: function (status, carouselWidth) {
    //   var left = 0;
    //   if (status) {
    //     left = -this.carouselIndex * this.carouselWidth;
    //   } else {
    //     left = this.getCarouselWrapLeft() + carouselWidth;
    //   }
    //   _this.setCarouselWrapLeft(left);
    // }
    constructor: Carousel
  };
  return Carousel;
});
