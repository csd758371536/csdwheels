import "../../../style/carousel/carousel.scss";

// polyfill requestAnimationFrame
let polyfillAnimation = () => {
  let lastTime = 0;
  let vendors = ["webkit", "moz"];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] || // Webkit中此取消方法的名字变了
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback, element) => {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      let id = window.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = id => {
      clearTimeout(id);
    };
  }
}

// polyfill event
let addEvent = (element, type, handler) => {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

class Carousel {
  // ID-NAMES
  static ID = {
    CAROUSEL_WRAP: "#carouselWrap",
    CAROUSEL_DOTS: "#carouselDots",
    ARROW_LEFT: "#arrowLeft",
    ARROW_RIGHT: "#arrowRight"
  };

  static CLASS = {
    CAROUSEL_WRAP: "carousel-wrap",
    CAROUSEL_IMG: "carousel-image",
    CAROUSEL_DOTS_WRAP: "carousel-buttons-wrap",
    CAROUSEL_DOTS: "carousel-buttons",
    CAROUSEL_DOT: "carousel-button",
    CAROUSEL_DOT_ON: "carousel-button on",
    CAROUSEL_ARROW_LEFT: "carousel-arrow arrow-left",
    CAROUSEL_ARROW_RIGHT: "carousel-arrow arrow-right"
  };

  // 轮播-构造函数
  constructor(selector, userOptions = {}) {
    // requestAnimationFrame兼容到IE6
    polyfillAnimation();
    // 默认配置
    this.carouselOptions = {
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
    };
    // 合并配置
    Object.assign(this.carouselOptions, userOptions);
    // 获取轮播元素
    this.carousel = document.querySelector(selector);
    // 初始化轮播列表
    this.carousel.appendChild(this.getImgs());
    // 获取轮播列表
    this.carouselWrap = document.querySelector(Carousel.ID.CAROUSEL_WRAP);
    // 每隔 50ms 检测一次轮播是否加载完成
    let checkInterval = 50;
    let checkTimer = setInterval(() => {
      // 检测轮播是否加载完成
      if (this.isCarouselComplete()) {
        // 加载完成后清除定时器
        clearInterval(checkTimer);
        // 初始化轮播
        this.initCarousel();
        // 初始化圆点
        this.initDots();
        // 初识化箭头
        this.initArrows();
      }
    }, checkInterval);
  }

  isCarouselComplete() {
    // 检测页面图片是否加载完成
    let completeCount = 0;
    for (let i = 0; i < this.carouselWrap.children.length; i++) {
      if (this.carouselWrap.children[i].complete) {
        completeCount++;
      }
    }
    return completeCount === this.carouselWrap.children.length ? true : false;
  }

  initCarousel(selector, userOptions) {
    // 获取轮播数量
    this.carouselCount = this.carouselWrap.children.length;
    // 设置轮播
    this.setCarousel();
    // 初始化轮播序号
    this.carouselIndex = 1;
    // 初始化定时器
    this.carouselIntervalr = null;
    // 每次位移量 = 总偏移量 / 次数
    this.carouselAnimateSpeed =
      this.carouselWidth /
      (this.carouselOptions.carouselAnimateTime /
        this.carouselOptions.carouselAnimateInterval);
    // 判断是否处于轮播动画状态
    this.isCarouselAnimate = false;
    // 判断圆点是否点击
    this.isDotClick = false;
    // 绑定轮播图事件
    this.bindCarousel();
    // 播放轮播
    this.playCarousel();
  }
  setCarousel() {
    // 复制首尾节点
    let first = this.carouselWrap.children[0].cloneNode(true);
    let last = this.carouselWrap.children[this.carouselCount - 1].cloneNode(
      true
    );
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
    this.setWidth(
      this.carouselWrap,
      this.carouselWidth * this.carouselWrap.children.length
    );
  }
  setWidth(elem, value) {
    elem.style.width = value + "px";
  }
  setHeight(elem, value) {
    elem.style.height = value + "px";
  }
  getWidth(elem) {
    return parseInt(elem.style.width);
  }
  setLeft(elem, value) {
    elem.style.left = value + "px";
  }
  getLeft(elem) {
    return parseInt(elem.style.left);
  }
  getImgs() {
    // 生成轮播图片DOM
    let carouselWrapEle = document.createElement("div");
    carouselWrapEle.setAttribute("class", Carousel.CLASS.CAROUSEL_WRAP);
    carouselWrapEle.setAttribute(
      "id",
      Carousel.ID.CAROUSEL_WRAP.substring(1, Carousel.ID.CAROUSEL_WRAP.length)
    );
    let fragment = document.createDocumentFragment();
    let imgEle = document.createElement("img");
    this.carouselOptions.carouselImages.forEach((carouselImage, index) => {
      imgEle = imgEle.cloneNode(false);
      imgEle.setAttribute("class", Carousel.CLASS.CAROUSEL_IMG);
      imgEle.setAttribute("src", carouselImage);
      imgEle.setAttribute("alt", index + 1);
      fragment.appendChild(imgEle);
    });
    carouselWrapEle.appendChild(fragment);
    return carouselWrapEle;
  }
  initArrows() {
    if (this.carouselOptions.showCarouselArrow) {
      // 初始化箭头
      this.carousel.appendChild(this.getArrows());
      // 获取箭头
      this.arrowLeft = document.querySelector(Carousel.ID.ARROW_LEFT);
      this.arrowRight = document.querySelector(Carousel.ID.ARROW_RIGHT);
      // 绑定箭头事件
      this.bindArrows();
    }
  }
  getArrows() {
    // 生成轮播箭头DOM
    let fragment = document.createDocumentFragment();
    let arrowLeftEle = document.createElement("a");
    let arrowRightEle = document.createElement("a");
    arrowLeftEle.setAttribute("href", "javascript:;");
    arrowLeftEle.setAttribute("class", Carousel.CLASS.CAROUSEL_ARROW_LEFT);
    arrowLeftEle.setAttribute(
      "id",
      Carousel.ID.ARROW_LEFT.substring(1, Carousel.ID.ARROW_LEFT.length)
    );
    arrowLeftEle.innerHTML = "&lt;";
    arrowRightEle.setAttribute("href", "javascript:;");
    arrowRightEle.setAttribute("class", Carousel.CLASS.CAROUSEL_ARROW_RIGHT);
    arrowRightEle.setAttribute(
      "id",
      Carousel.ID.ARROW_RIGHT.substring(1, Carousel.ID.ARROW_RIGHT.length)
    );
    arrowRightEle.innerHTML = "&gt;";
    fragment.appendChild(arrowLeftEle);
    fragment.appendChild(arrowRightEle);
    return fragment;
  }
  initDots() {
    if (this.carouselOptions.showCarouselDot) {
      // 初始化圆点DOM
      this.carousel.appendChild(this.getDots());
      // 获取圆点
      this.carouselDots = document.querySelector(Carousel.ID.CAROUSEL_DOTS);
      // 设置圆点位置
      this.setDot();
      // 绑定圆点事件
      this.bindDots();
    }
  }
  getDots() {
    // 生成轮播圆点DOM
    let dotsWrap = document.createElement("div");
    dotsWrap.setAttribute("class", Carousel.CLASS.CAROUSEL_DOTS_WRAP);
    let dots = document.createElement("div");
    dots.setAttribute("class", Carousel.CLASS.CAROUSEL_DOTS);
    dots.setAttribute(
      "id",
      Carousel.ID.CAROUSEL_DOTS.substring(1, Carousel.ID.CAROUSEL_DOTS.length)
    );
    let fragment = document.createDocumentFragment();
    let spanEle = document.createElement("span");
    for (let i = 0, len = this.carouselCount; i < len; i++) {
      spanEle = spanEle.cloneNode(false);
      spanEle.setAttribute("class", Carousel.CLASS.CAROUSEL_DOT);
      fragment.appendChild(spanEle);
    }
    dots.appendChild(fragment);
    dotsWrap.appendChild(dots);
    return dotsWrap;
  }
  bindDots() {
    for (let i = 0, len = this.carouselDots.children.length; i < len; i++) {
      addEvent(this.carouselDots.children[i], "click", ev => {
        // 获取点击的圆点序号
        this.dotIndex = i + 1;
        if (!this.isCarouselAnimate && this.carouselIndex !== this.dotIndex) {
          // 改变圆点点击状态
          this.isDotClick = true;
          // 改变圆点位置
          this.moveDot();
        }
      });
    }
  }
  moveDot() {
    // 改变轮播DOM，增加过渡效果
    this.changeCarousel();
    // 改变当前轮播序号
    this.carouselIndex = this.dotIndex;
    // 重设当前圆点样式
    this.setDot();
  }
  changeCarousel() {
    // 保存当前节点位置
    this.currentNode = this.carouselWrap.children[this.carouselIndex];
    // 获取目标节点位置
    let targetNode = this.carouselWrap.children[this.dotIndex];
    // 判断点击圆点与当前的相对位置
    if (this.carouselIndex < this.dotIndex) {
      // 在当前元素右边插入目标节点
      let nextNode = this.currentNode.nextElementSibling;
      this.carouselWrap.insertBefore(targetNode.cloneNode(true), nextNode);
      this.moveCarousel(
        this.getLeft(this.carouselWrap) - this.carouselWidth,
        -this.carouselAnimateSpeed
      );
    }
    if (this.carouselIndex > this.dotIndex) {
      // 在当前元素左边插入目标节点
      this.carouselWrap.insertBefore(
        targetNode.cloneNode(true),
        this.currentNode
      );
      // 因为向左边插入节点后，当前元素的位置被改变，导致画面有抖动现象，这里重置为新的位置
      this.setLeft(
        this.carouselWrap,
        -(this.carouselIndex + 1) * this.carouselWidth
      );
      this.moveCarousel(
        this.getLeft(this.carouselWrap) + this.carouselWidth,
        this.carouselAnimateSpeed
      );
    }
  }
  setDot() {
    for (let i = 0, len = this.carouselDots.children.length; i < len; i++) {
      this.carouselDots.children[i].setAttribute("class", Carousel.CLASS.CAROUSEL_DOT);
    }
    this.carouselDots.children[this.carouselIndex - 1].setAttribute(
      "class",
      Carousel.CLASS.CAROUSEL_DOT_ON
    );
  }
  playCarousel() {
    if (this.carouselIntervalr) {
      clearInterval(this.carouselIntervalr);
    }
    this.carouselIntervalr = window.setInterval(() => {
      this.nextCarousel();
    }, this.carouselOptions.carouselInterval);
  }
  bindCarousel() {
    // 鼠标移入移出事件
    addEvent(this.carousel, "mouseenter", e => {
      clearInterval(this.carouselIntervalr);
    });
    addEvent(this.carousel, "mouseleave", e => {
      this.playCarousel();
    });
    addEvent(document, "visibilitychange", e => {
      if (document.hidden) {
        clearInterval(this.carouselIntervalr);
      } else {
        this.playCarousel();
      }
    });
  }
  bindArrows() {
    // 箭头点击事件
    addEvent(this.arrowLeft, "click", e => {
      this.prevCarousel();
    });
    addEvent(this.arrowRight, "click", e => {
      this.nextCarousel();
    });
  }
  isFirstCarousel() {
    let left = 0;
    return this.getLeft(this.carouselWrap) === left ? true : false;
  }
  isLastCarousel() {
    let left = this.carouselWidth - this.getWidth(this.carouselWrap);
    return this.getLeft(this.carouselWrap) === left ? true : false;
  }
  prevCarousel() {
    if (!this.isCarouselAnimate) {
      // 改变轮播序号
      this.carouselIndex--;
      if (this.carouselIndex < 1) {
        this.carouselIndex = this.carouselCount;
      }
      // 设置轮播位置
      this.moveCarousel(
        this.getLeft(this.carouselWrap) + this.carouselWidth,
        this.carouselAnimateSpeed
      );
      if (this.carouselOptions.showCarouselDot) {
        // 显示当前圆点
        this.setDot();
      }
    }
  }
  nextCarousel() {
    if (!this.isCarouselAnimate) {
      this.carouselIndex++;
      if (this.carouselIndex > this.carouselCount) {
        this.carouselIndex = 1;
      }
      this.moveCarousel(
        this.getLeft(this.carouselWrap) - this.carouselWidth,
        -this.carouselAnimateSpeed
      );
      if (this.carouselOptions.showCarouselDot) {
        // 显示当前圆点
        this.setDot();
      }
    }
  }
  moveCarousel(target, speed) {
    this.isCarouselAnimate = true;
    let timer = window.requestAnimationFrame(() => {
      animateCarousel(target, speed);
    });
  }
  animateCarousel(target, speed) {
    if (
      (speed > 0 && this.getLeft(this.carouselWrap) < target) ||
      (speed < 0 && this.getLeft(this.carouselWrap) > target)
    ) {
      this.setLeft(this.carouselWrap, this.getLeft(this.carouselWrap) + speed);
      timer = window.requestAnimationFrame(() => {
        animateCarousel(target, speed);
      });
    } else {
      window.cancelAnimationFrame(timer);
      // 重置轮播状态
      this.resetCarousel(target, speed);
    }
  }
  resetCarousel(target, speed) {
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
  }
  resetMoveDot(speed) {
    // 如果是圆点点击触发动画，需要删除新增的过度节点并将轮播位置重置到实际位置
    this.setLeft(this.carouselWrap, -this.dotIndex * this.carouselWidth);
    // 判断点击圆点和当前圆点的相对位置
    if (speed < 0) {
      this.carouselWrap.removeChild(this.currentNode.nextElementSibling);
    } else {
      this.carouselWrap.removeChild(this.currentNode.previousElementSibling);
    }
  }
  resetMoveCarousel(target) {
    // 不符合位移条件，把当前left值置为目标值
    this.setLeft(this.carouselWrap, target);
    //如当前在辅助图上，就归位到真的图上
    if (target > -this.carouselWidth) {
      this.setLeft(this.carouselWrap, -this.carouselCount * this.carouselWidth);
    }
    if (target < -this.carouselWidth * this.carouselCount) {
      this.setLeft(this.carouselWrap, -this.carouselWidth);
    }
  }
}

export default Carousel;
