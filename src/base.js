;(function(window, document, undefined) {
  'use strict';
  var Base = function() {

  };
  Base.prototype = {

  };
  window.Base = Base;
})(window, document);
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
