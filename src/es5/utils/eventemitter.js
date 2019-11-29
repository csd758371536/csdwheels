(function() {
  var root =
    (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global) ||
    this ||
    {};

  function isValidListener(listener) {
    if (typeof listener === 'function') {
      return true;
    } else if (listener && typeof listener === 'object') {
      return isValidListener(listener.listener);
    } else {
      return false;
    }
  }

  function indexOf(array, item) {
    var result = -1;
    item = typeof item === 'object' ? item.listener : item;

    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i].listener === item) {
        result = i;
        break;
      }
    }

    return result;
  }

  function EventEmitter() {
    this.__events = {};
  }

  EventEmitter.VERSION = '1.0.0';

  var proto = EventEmitter.prototype;

  /**
   * 添加事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  proto.on = function(eventName, listener) {
    if (!eventName || !listener) return;

    if (!isValidListener(listener)) {
      throw new TypeError('listener must be a function');
    }

    var events = this.__events;
    var listeners = (events[eventName] = events[eventName] || []);
    var listenerIsWrapped = typeof listener === 'object';

    // 不重复添加事件
    if (indexOf(listeners, listener) === -1) {
      listeners.push(
        listenerIsWrapped
          ? listener
          : {
              listener: listener,
              once: false,
            },
      );
    }

    return this;
  };

  /**
   * 添加事件，该事件只能被执行一次
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  proto.once = function(eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true,
    });
  };

  /**
   * 删除事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  proto.off = function(eventName, listener) {
    var listeners = this.__events[eventName];
    if (!listeners) return;

    var index;
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        index = i;
        break;
      }
    }

    if (typeof index !== 'undefined') {
      listeners.splice(index, 1, null);
    }

    return this;
  };

  /**
   * 触发事件
   * @param  {String} eventName 事件名称
   * @param  {Array} args 传入监听器函数的参数，使用数组形式传入
   * @return {Object} 可链式调用
   */
  proto.emit = function(eventName, args) {
    var listeners = this.__events[eventName];
    if (!listeners) return;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener) {
        listener.listener.apply(this, args || []);
        if (listener.once) {
          this.off(eventName, listener.listener);
        }
      }
    }

    return this;
  };

  /**
   * 删除某一个类型的所有事件或者所有事件
   * @param  {String[]} eventName 事件名称
   */
  proto.allOff = function(eventName) {
    if (eventName && this.__events[eventName]) {
      this.__events[eventName] = [];
    } else {
      this.__events = {};
    }
  };

  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = EventEmitter;
    }
    exports.EventEmitter = EventEmitter;
  } else {
    root.EventEmitter = EventEmitter;
  }
})();

// (function(root, factory) {
//   if (typeof define === "function" && define.amd) {
//     define([], factory);
//   } else if (typeof module === "object" && module.exports) {
//     module.exports = factory();
//   } else {
//     root.EventEmitter = factory();
//   }
// })(typeof self !== "undefined" ? self : this, function() {
//   "use strict";

//   var EventEmitter = function() {
//     this._listener = {};
//   };
//   EventEmitter.prototype = {
//     constructor: EventEmitter,
//     addEvent: function(type, fn) {
//       if (typeof type === "string" && typeof fn === "function") {
//         if (typeof this._listener[type] === "undefined") {
//           this._listener[type] = [fn];
//         } else {
//           this._listener[type].push(fn);
//         }
//       }
//       return this;
//     },
//     addEvents: function(obj) {
//       obj = typeof obj === "object" ? obj : {};
//       var type;
//       for (type in obj) {
//         if (type && typeof obj[type] === "function") {
//           this.addEvent(type, obj[type]);
//         }
//       }
//       return this;
//     },
//     fireEvent: function(type) {
//       if (type && this._listener[type]) {
//         var events = {
//           type: type,
//           target: this
//         };
//         for (
//           var length = this._listener[type].length, start = 0;
//           start < length;
//           start += 1
//         ) {
//           this._listener[type][start].call(this, events);
//         }
//       }
//       return this;
//     },
//     fireEvents: function(array) {
//       if (array instanceof Array) {
//         for (var i = 0, length = array.length; i < length; i += 1) {
//           this.fireEvent(array[i]);
//         }
//       }
//       return this;
//     },
//     removeEvent: function(type, key) {
//       var listeners = this._listener[type];
//       if (listeners instanceof Array) {
//         if (typeof key === "function") {
//           for (var i = 0, length = listeners.length; i < length; i += 1) {
//             if (listeners[i] === key) {
//               listeners.splice(i, 1);
//               break;
//             }
//           }
//         } else if (key instanceof Array) {
//           for (var lis = 0, lenkey = key.length; lis < lenkey; lis += 1) {
//             this.removeEvent(type, key[lenkey]);
//           }
//         } else {
//           delete this._listener[type];
//         }
//       }
//       return this;
//     },
//     removeEvents: function(params) {
//       if (params instanceof Array) {
//         for (var i = 0, length = params.length; i < length; i += 1) {
//           this.removeEvent(params[i]);
//         }
//       } else if (typeof params === "object") {
//         for (var type in params) {
//           this.removeEvent(type, params[type]);
//         }
//       }
//       return this;
//     }
//   };

//   return EventEmitter;
// });
