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
  function extend(o, n) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
        o[p] = n[p];
    }
  }

  function mergeOptions(userOptions, options) {
    Object.keys(userOptions).forEach(function(key) {
      options[key] = userOptions[key];
    });
  }

  // polyfill
  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function() {
        handler.call(element);
      });
    } else {
      element['on' + type] = handler;
    }
  }

  // plugin construct function
  function Plugin(selector, userOptions) {
    this.init(selector, userOptions)
  }
  Plugin.prototype = {
    construct: Plugin,
    // default option
    options: {},
    init: function(selector, userOptions) {
      extend(this.option, userOptions);
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
