import "../../../style/carousel/carousel-mobile.scss";

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

class CarouselMobile {
  // ID-NAMES
  static ID = {
    CAROUSEL_WRAP: "#carouselWrap"
  }

  static CLASS = {
    CAROUSEL_WRAP: "carousel-wrap",
    CAROUSEL_IMG: "carousel-image"
  }

  // 轮播-构造函数
  constructor (selector, userOptions = {}) {
    this.carouselOptions = {
        // 轮播自动播放间隔
        carouselInterval: 3000,
        // 轮播滑动一次的时间
        carouselDuration: 300
    };
    // 合并配置
    Object.assign(this.carouselOptions, userOptions);
    // 获取轮播元素
    this.carousel = document.querySelector(selector);
    // 初始化轮播列表
    this.carousel.appendChild(this.getImgs());
    // 获取轮播列表
    this.carouselWrap = document.querySelector(CarouselMobile.ID.CAROUSEL_WRAP);
    // 每隔 50ms 检测一次轮播是否加载完成
    let checkInterval = 50;
    let checkTimer = setInterval(() => {
      // 检测轮播是否加载完成
      if (this.isCarouselComplete()) {
        // 加载完成后清除定时器
        clearInterval(checkTimer);
        // 初始化轮播
        this.initCarousel();
      }
    }, checkInterval);
  }

  isCarouselComplete () {
    // 检测页面图片是否加载完成
    let completeCount = 0;
    for (let i = 0; i < this.carouselWrap.children.length; i++) {
      if (this.carouselWrap.children[i].complete) {
        completeCount++;
      }
    }
    return completeCount === this.carouselWrap.children.length ? true : false;
  }

  initCarousel (selector, userOptions) {
    // 获取轮播数量
    this.carouselCount = this.carouselWrap.children.length;
    // 设置轮播
    this.setCarousel();
    // 初始化轮播序号
    this.carouselIndex = 1;
    // 初始化定时器
    this.carouselIntervalr = null;
    // 判断是否处于轮播动画状态
    this.isCarouselAnimate = false;
    // 保存轮播触摸状态
    this.carouselTouch = {
      startX: 0,
      start: 0,
      move: 0,
      end: 0,
      offset: 0.3
    };
    // 绑定轮播图事件
    this.bindCarousel();
    // 播放轮播
    this.playCarousel();
  }

  setCarousel () {
    // 复制首尾节点
    let first = this.carouselWrap.children[0].cloneNode(true);
    let last = this.carouselWrap.children[this.carouselCount - 1].cloneNode(
      true
    );
    // 添加过渡元素
    this.carouselWrap.insertBefore(last, this.carouselWrap.children[0]);
    this.carouselWrap.appendChild(first);
    // 获取轮播宽度
    this.carouselWidth = this.getCarouselWidth();
    // 设置初始位置
    this.setTransform(this.carouselWrap, -this.carouselWidth);
  }

  getCarouselWidth () {
    return parseInt(this.carousel.offsetWidth);
  }

  setTransition (elem, value) {
    elem.style.transition = value + "ms";
  }

  setTransform (elem, value) {
    elem.style.transform = "translate3d(" + value + "px, 0px, 0px)";
    elem.style["-webkit-transform"] =
      "translate3d(" + value + "px, 0px, 0px)";
    elem.style["-ms-transform"] = "translate3d(" + value + "px, 0px, 0px)";
  }

  getTransform () {
    let x =
      this.carouselWrap.style.transform ||
      this.carouselWrap.style["-webkit-transform"] ||
      this.carouselWrap.style["-ms-transform"];
    x = x.substring(12);
    x = x.match(/(\S*)px/)[1];
    return Number(x);
  }

  getImgs () {
    let carouselWrapEle = document.createElement("div");
    carouselWrapEle.setAttribute("class", CarouselMobile.CLASS.CAROUSEL_WRAP);
    carouselWrapEle.setAttribute(
      "id",
      CarouselMobile.ID.CAROUSEL_WRAP.substring(1, CarouselMobile.ID.CAROUSEL_WRAP.length)
    );
    let fragment = document.createDocumentFragment();
    let imgEle = document.createElement("img");
    this.carouselOptions.carouselImages.forEach((
      carouselImage,
      index
    ) => {
      imgEle = imgEle.cloneNode(false);
      imgEle.setAttribute("class", CarouselMobile.CLASS.CAROUSEL_IMG);
      imgEle.setAttribute("src", carouselImage);
      imgEle.setAttribute("alt", index + 1);
      fragment.appendChild(imgEle);
    });
    carouselWrapEle.appendChild(fragment);
    return carouselWrapEle;
  }

  playCarousel () {
    if (this.carouselIntervalr) {
      clearInterval(this.carouselIntervalr);
    }
    this.carouselIntervalr = window.setInterval(() => {
      this.nextCarousel();
    }, this.carouselOptions.carouselInterval);
  }

  bindCarousel () {
    // 鼠标移入移出事件
    addEvent(this.carousel, "touchstart", (e) => {
      if (!this.isCarouselAnimate) {
        clearInterval(this.carouselIntervalr);
        this.carouselTouch.startX = this.getTransform();
        this.carouselTouch.start =
          e.changedTouches[e.changedTouches.length - 1].clientX;
      }
    });
    addEvent(this.carousel, "touchmove", (e) => {
      if (!this.isCarouselAnimate && this.carouselTouch.start != -1) {
        clearInterval(this.carouselIntervalr);
        this.carouselTouch.move =
          e.changedTouches[e.changedTouches.length - 1].clientX -
          this.carouselTouch.start;
        this.setTransform(
          this.carouselWrap,
          this.carouselTouch.move + this.carouselTouch.startX
        );
      }
    });
    addEvent(this.carousel, "touchend", (e) => {
      if (!this.isCarouselAnimate && this.carouselTouch.start != -1) {
        clearInterval(this.carouselIntervalr);
        this.setTransform(
          this.carouselWrap,
          this.carouselTouch.move + this.carouselTouch.startX
        );
        let x = this.getTransform();
        x +=
          this.carouselTouch.move > 0
            ? this.carouselWidth * this.carouselTouch.offset
            : this.carouselWidth * -this.carouselTouch.offset;
        this.carouselIndex = Math.round(x / this.carouselWidth) * -1;
        this.moveCarousel(this.carouselIndex * -this.carouselWidth);
        if (this.carouselIndex > this.carouselCount) {
          this.carouselIndex = 1;
        }
        if (this.carouselIndex < 1) {
          this.carouselIndex = this.carouselCount;
        }
        this.playCarousel();
      }
    });
    addEvent(document, "visibilitychange", (e) => {
      if (document.hidden) {
        clearInterval(this.carouselIntervalr);
      } else {
        this.playCarousel();
      }
    });
  }

  nextCarousel () {
    if (!this.isCarouselAnimate) {
      this.carouselIndex++;
      if (this.carouselIndex > this.carouselCount) {
        this.carouselIndex = 1;
      }
      this.moveCarousel(this.getTransform() - this.carouselWidth);
    }
  }

  moveCarousel (target) {
    this.isCarouselAnimate = true;
    this.setTransition(
      this.carouselWrap,
      this.carouselOptions.carouselDuration
    );
    this.setTransform(this.carouselWrap, target);
    this.resetCarousel(target);
  }

  resetCarousel (target) {
    window.setTimeout(() => {
      // 重置箭头或者自动轮播后的状态
      this.resetMoveCarousel(target);
      this.isCarouselAnimate = false;
    }, this.carouselOptions.carouselDuration);
  }

  resetMoveCarousel (target) {
    this.setTransition(this.carouselWrap, 0);
    // 不符合位移条件，把当前left值置为目标值
    this.setTransform(this.carouselWrap, target);
    //如当前在辅助图上，就归位到真的图上
    if (target > -this.carouselWidth) {
      this.setTransform(
        this.carouselWrap,
        -this.carouselCount * this.carouselWidth
      );
    }
    if (target < -this.carouselWidth * this.carouselCount) {
      this.setTransform(this.carouselWrap, -this.carouselWidth);
    }
  }
}

export default CarouselMobile;
