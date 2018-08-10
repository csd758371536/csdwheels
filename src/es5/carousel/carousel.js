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

  // 第一种实现 js动画 用settimeout+left or requestAnimationFrame+transform
  // 第二种 css动画 transform .6s ease-in-out  translate3d(0,0,0)

  // 参考vue-swiper   transform + transition-duration
  // 实现移动端轮播，响应式，支持手势滑动

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

  // requestAnimationFrame兼容到IE6
  (function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
  }());

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
      // 是否显示轮播箭头
      showCarouselArrow: true,
      // 是否显示轮播圆点
      showCarouselDot: true,
      // 轮播自动播放间隔
      carouselInterval: 3000,
      // 轮播动画总时间
      carouselAnimateTime: 150,
      // 轮播动画间隔
      carouselAnimateInterval: 10
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
      this.carouselIntervalr = null;
      // 每次位移量 = 总偏移量 / 次数
      this.carouselAnimateSpeed = this.carouselWidth / (this.carouselOptions.carouselAnimateTime / this.carouselOptions.carouselAnimateInterval);
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
      // 复制首尾节点
      var first = this.carouselWrap.children[0].cloneNode(true);
      var last = this.carouselWrap.children[this.carouselCount - 1].cloneNode(true);
      // 添加过渡元素
      this.carouselWrap.insertBefore(last, this.carouselWrap.children[0]);
      this.carouselWrap.appendChild(first);
      // 设置轮播宽度
      this.setWidth(this.carousel, this.carouselOptions.carouselWidth);
      // 设置轮播高度
      this.setHeight(this.carousel, this.carouselOptions.carouselHeight);
      // 获取轮播宽度
      this.carouselWidth = this.getWidth(this.carousel);
      // 设置初始位置
      this.setLeft(this.carouselWrap, -this.carouselWidth);
      // 设置轮播长度
      this.setWidth(this.carouselWrap, this.carouselWidth * this.carouselWrap.children.length);
    },
    setWidth: function (elem, value) {
      elem.style.width = value + 'px';
    },
    setHeight: function (elem, value) {
      elem.style.height = value + 'px';
    },
    getWidth: function (elem) {
      return parseInt(elem.style.width);
    },
    setLeft: function (elem, value) {
      elem.style.left = value + 'px';
    },
    getLeft: function (elem) {
      return parseInt(elem.style.left);
    },
    getImgs: function () {
      // 生成轮播图片DOM
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
      if (this.carouselOptions.showCarouselArrow) {
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
      // 生成轮播箭头DOM
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
      if (this.carouselOptions.showCarouselDot) {
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
      // 生成轮播圆点DOM
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
            // 获取点击的圆点序号
            _this.dotIndex = i + 1;
            if (!_this.isCarouselAnimate && _this.carouselIndex !== _this.dotIndex) {
              // 改变圆点点击状态
              _this.isDotClick = true;
              // 改变圆点位置
              _this.moveDot();
              // _this.setLeft(_this.carouselWrap, -_this.carouselWidth * dotIndex);
              // _this.carouselIndex = _this.dotIndex;
              // _this.setDot();
            }
          });
        })(i);
      }
    },
    moveDot: function () {
      // 改变轮播DOM，增加过渡效果
      this.changeCarousel();
      // 改变当前轮播序号
      this.carouselIndex = this.dotIndex;
      // 重设当前圆点样式
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
        this.moveCarousel(this.getLeft(this.carouselWrap) - this.carouselWidth, -this.carouselAnimateSpeed);
      }
      if (this.carouselIndex > this.dotIndex) {
        // _this.moveCarousel(-_this.carouselWidth * dotIndex, _this.carouselAnimateSpeed * 2);
        // 在当前元素左边插入目标节点
        this.carouselWrap.insertBefore(targetNode.cloneNode(true), this.currentNode);
        // 因为向左边插入节点后，当前元素的位置被改变，导致画面有抖动现象，这里重置为新的位置
        this.setLeft(this.carouselWrap, -(this.carouselIndex + 1) * this.carouselWidth);
        this.moveCarousel(this.getLeft(this.carouselWrap) + this.carouselWidth, this.carouselAnimateSpeed);
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
      this.carouselIntervalr = window.setInterval(function() {
        _this.nextCarousel();
      }, this.carouselOptions.carouselInterval);
    },
    bindCarousel: function () {
      var _this = this;
      // 鼠标移入移出事件
      addEvent(this.carousel, 'mouseenter', function(e) {
        clearInterval(_this.carouselIntervalr);
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
      return this.getLeft(this.carouselWrap) === left ? true : false;
    },
    isLastCarousel: function () {
      var left = this.carouselWidth - this.getWidth(this.carouselWrap);
      return this.getLeft(this.carouselWrap) === left ? true : false;
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
        this.moveCarousel(this.getLeft(this.carouselWrap) + this.carouselWidth, this.carouselAnimateSpeed);
        if (this.carouselOptions.showCarouselDot) {
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
        this.moveCarousel(this.getLeft(this.carouselWrap) - this.carouselWidth,  -this.carouselAnimateSpeed);
        if (this.carouselOptions.showCarouselDot) {
          // 显示当前圆点
          this.setDot();
        }
      }
    },
    moveCarousel: function (target, speed) {
      var _this = this;
      _this.isCarouselAnimate = true;
      function animateCarousel () {
        if ((speed > 0 && _this.getLeft(_this.carouselWrap) < target) ||
            (speed < 0 && _this.getLeft(_this.carouselWrap) > target)) {
          _this.setLeft(_this.carouselWrap, _this.getLeft(_this.carouselWrap) + speed);
          // window.setTimeout(animateCarousel, _this.carouselOptions.carouselAnimateInterval);
          timer = window.requestAnimationFrame(animateCarousel);
        } else {
          // window.clearTimeout(timer);
          window.cancelAnimationFrame(timer);
          // 重置轮播状态
          _this.resetCarousel(target, speed);
        }
      }
      // animateCarousel();
      var timer = window.requestAnimationFrame(animateCarousel);
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
      this.setLeft(this.carouselWrap, -this.dotIndex * this.carouselWidth);
      // 判断点击圆点和当前圆点的相对位置
      if (speed < 0) {
        this.carouselWrap.removeChild(this.currentNode.nextElementSibling);
      } else {
        this.carouselWrap.removeChild(this.currentNode.previousElementSibling);
      }
    },
    resetMoveCarousel: function (target) {
      // 不符合位移条件，把当前left值置为目标值
      this.setLeft(this.carouselWrap, target);
      //如当前在辅助图上，就归位到真的图上
      if (target > -this.carouselWidth ) {
        this.setLeft(this.carouselWrap, -this.carouselCount * this.carouselWidth);
      }
      if (target < (-this.carouselWidth * this.carouselCount)) {
        this.setLeft(this.carouselWrap, -this.carouselWidth);
      }
    },
    // moveCarousel: function (status, carouselWidth) {
    //   var left = 0;
    //   if (status) {
    //     left = -this.carouselIndex * this.carouselWidth;
    //   } else {
    //     left = this.getLeft(this.carouselWrap) + carouselWidth;
    //   }
    //   _this.setLeft(this.carouselWrap, left);
    // }
    constructor: Carousel
  };
  return Carousel;
});
