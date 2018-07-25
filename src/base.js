; // JavaScript弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误
(function(window, document, undefined) {
  'use strict';
  var Base = function() {
    // 判断是用函数创建的还是用new创建的。这样我们就可以通过Base() 或 new Base()来使用这个插件了
    if (!(this instanceof Base)) return new Base();
    this.init();
  };
  Base.prototype = {
    construct: Base,
    init: function() {

    }
  };
  window.Base = Base;
})(window, document);

// 检查配置的必填参数是否错误
// if (!option.hasOwnProperty('data')) {
//   throw 'missing required arguments: data';
// }

;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Plugin = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // tool
  function extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }

  function mergeOptions(userOptions, options) {
    Object.keys(userOptions).forEach(function(key) {
      options[key] = userOptions[key];
    });
  }

  // polyfill
  var EventUtil = {
    addEvent: function(element, type, handler) {
      // 添加绑定
      if (element.addEventListener) {
        // 使用DOM2级方法添加事件
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        // 使用IE方法添加事件
        element.attachEvent("on" + type, handler);
      } else {
        // 使用DOM0级方法添加事件
        element["on" + type] = handler;
      }
    },
    // 移除事件
    removeEvent: function(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.datachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    },
    getEvent: function(event) {
      // 返回事件对象引用
      return event ? event : window.event;
    },
    // 获取mouseover和mouseout相关元素
    getRelatedTarget: function(event) {
      if (event.relatedTarget) {
        return event.relatedTarget;
      } else if (event.toElement) {
        // 兼容IE8-
        return event.toElement;
      } else if (event.formElement) {
        return event.formElement;
      } else {
        return null;
      }
    },
    getTarget: function(event) {
      //返回事件源目标
      return event.target || event.srcElement;
    },
    preventDefault: function(event) {
      //取消默认事件
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    stoppropagation: function(event) {
      //阻止事件流
      if (event.stoppropagation) {
        event.stoppropagation();
      } else {
        event.canceBubble = false;
      }
    },
    // 获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
    getButton: function(event) {
      if (document.implementation.hasFeature("MouseEvents", "2.0")) {
        return event.button;
      } else {
        //将IE模型下的button属性映射为DOM模型下的button属性
        switch (event.button) {
          case 0:
          case 1:
          case 3:
          case 5:
          case 7:
            //按下的是鼠标主按钮（一般是左键）
            return 0;
          case 2:
          case 6:
            //按下的是中间的鼠标按钮
            return 2;
          case 4:
            //鼠标次按钮（一般是右键）
            return 1;
        }
      }
    },
    //获取表示鼠标滚轮滚动方向的数值
    getWheelDelta: function(event) {
      if (event.wheelDelta) {
        return event.wheelDelta;
      } else {
        return -event.detail * 40;
      }
    },
    // 以跨浏览器取得相同的字符编码，需在keypress事件中使用
    getCharCode: function(event) {
      if (typeof event.charCode == "number") {
        return event.charCode;
      } else {
        return event.keyCode;
      }
    }
  };

  // plugin construct function
  function Plugin(selector, userOptions) {
    // Plugin() or new Plugin()
    if (!(this instanceof Plugin)) return new Plugin(selector, userOptions);
    this.init(selector, userOptions)
  }
  Plugin.prototype = {
    constructor: Plugin,
    // default option
    options: {},
    init: function(selector, userOptions) {
      extend(this.options, userOptions, true);
    }
  };

  return Plugin;
}));


// var plugin =(function(){
//      function _firstFunc(str){
//          alert(str);
//      };
//      return{
//          firstFunc: _firstFunc,
//      };
//  })();

//  ;(function (root, factory) {
//      if (typeof define === 'function' && define.amd) {
//          // AMD
//          define(['jsUtils'], factory);
//      } else if (typeof exports === 'object' && module.exports) {
//          // Node, CommonJS之类的
//          module.exports = factory(require('jsUtils'));
//      } else {
//          // 浏览器全局变量(root 即 window)
//          root.returnExports = factory(root.jsUtils);
//      }
//  }(typeof self !== 'undefined' ? self : this, function(jsUtils) {
//    'use strict';
//
//    var jsUtils = new jsUtils();
//    console.log(jsUtils.type('SSS'));
//
//    return {};
// }));
