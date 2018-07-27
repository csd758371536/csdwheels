/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/pagination/pagination.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/pagination/pagination.js":
/*!**************************************!*\
  !*** ./src/pagination/pagination.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// (function(root, factory) {\r\n//   if (typeof define === \"function\" && define.amd) {\r\n//     define([], factory);\r\n//   } else if (typeof module === \"object\" && module.exports) {\r\n//     module.exports = factory();\r\n//   } else {\r\n//     root.Pagination = factory();\r\n//   }\r\n// })(typeof self !== \"undefined\" ? self : this, function() {\r\n//   \"use strict\";\r\n\r\n//   // 元素类名\r\n//   var CLASS_NAME = {\r\n//     ITEM: 'pagination-item',\r\n//     LINK: 'pagination-link'\r\n//   };\r\n\r\n//   // 跨浏览器事件对象\r\n//   var EventUtil = {\r\n//     addEvent: function(element, type, handler) {\r\n//       // 添加绑定\r\n//       if (element.addEventListener) {\r\n//         // 使用DOM2级方法添加事件\r\n//         element.addEventListener(type, handler, false);\r\n//       } else if (element.attachEvent) {\r\n//         // 使用IE方法添加事件\r\n//         element.attachEvent(\"on\" + type, handler);\r\n//       } else {\r\n//         // 使用DOM0级方法添加事件\r\n//         element[\"on\" + type] = handler;\r\n//       }\r\n//     },\r\n//     // 移除事件\r\n//     removeEvent: function(element, type, handler) {\r\n//       if (element.removeEventListener) {\r\n//         element.removeEventListener(type, handler, false);\r\n//       } else if (element.datachEvent) {\r\n//         element.detachEvent(\"on\" + type, handler);\r\n//       } else {\r\n//         element[\"on\" + type] = null;\r\n//       }\r\n//     },\r\n//     getEvent: function(event) {\r\n//       // 返回事件对象引用\r\n//       return event ? event : window.event;\r\n//     },\r\n//     // 获取mouseover和mouseout相关元素\r\n//     getRelatedTarget: function(event) {\r\n//       if (event.relatedTarget) {\r\n//         return event.relatedTarget;\r\n//       } else if (event.toElement) {\r\n//         // 兼容IE8-\r\n//         return event.toElement;\r\n//       } else if (event.formElement) {\r\n//         return event.formElement;\r\n//       } else {\r\n//         return null;\r\n//       }\r\n//     },\r\n//     getTarget: function(event) {\r\n//       //返回事件源目标\r\n//       return event.target || event.srcElement;\r\n//     },\r\n//     preventDefault: function(event) {\r\n//       //取消默认事件\r\n//       if (event.preventDefault) {\r\n//         event.preventDefault();\r\n//       } else {\r\n//         event.returnValue = false;\r\n//       }\r\n//     },\r\n//     stoppropagation: function(event) {\r\n//       //阻止事件流\r\n//       if (event.stoppropagation) {\r\n//         event.stoppropagation();\r\n//       } else {\r\n//         event.canceBubble = false;\r\n//       }\r\n//     },\r\n//     // 获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个\r\n//     getButton: function(event) {\r\n//       if (document.implementation.hasFeature(\"MouseEvents\", \"2.0\")) {\r\n//         return event.button;\r\n//       } else {\r\n//         //将IE模型下的button属性映射为DOM模型下的button属性\r\n//         switch (event.button) {\r\n//           case 0:\r\n//           case 1:\r\n//           case 3:\r\n//           case 5:\r\n//           case 7:\r\n//             //按下的是鼠标主按钮（一般是左键）\r\n//             return 0;\r\n//           case 2:\r\n//           case 6:\r\n//             //按下的是中间的鼠标按钮\r\n//             return 2;\r\n//           case 4:\r\n//             //鼠标次按钮（一般是右键）\r\n//             return 1;\r\n//         }\r\n//       }\r\n//     },\r\n//     //获取表示鼠标滚轮滚动方向的数值\r\n//     getWheelDelta: function(event) {\r\n//       if (event.wheelDelta) {\r\n//         return event.wheelDelta;\r\n//       } else {\r\n//         return -event.detail * 40;\r\n//       }\r\n//     },\r\n//     // 以跨浏览器取得相同的字符编码，需在keypress事件中使用\r\n//     getCharCode: function(event) {\r\n//       if (typeof event.charCode == \"number\") {\r\n//         return event.charCode;\r\n//       } else {\r\n//         return event.keyCode;\r\n//       }\r\n//     }\r\n//   };\r\n\r\n//   // 浅拷贝一个对象的属性\r\n//   function extend(o, n, override) {\r\n//     for (var p in n) {\r\n//       if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))\r\n//         o[p] = n[p];\r\n//     }\r\n//   }\r\n\r\n//   // 模仿jQuery $()\r\n//   function $(selector, context) {\r\n//     context = arguments.length > 1 ? context : document;\r\n//     return context ? context.querySelectorAll(selector) : null;\r\n//   }\r\n\r\n//   var Pagination = function(selector, pageOption) {\r\n//     // 默认配置\r\n//     this.options = {\r\n//       curr: 1,\r\n//       pageShow: 2,\r\n//       ellipsis: true,\r\n//       hash: false\r\n//     };\r\n//     // 合并配置\r\n//     extend(this.options, pageOption, true);\r\n//     // 分页器元素\r\n//     this.pageElement = $(selector)[0];\r\n//     // 数据总数\r\n//     this.dataCount = this.options.count;\r\n//     // 当前页码\r\n//     this.pageNumber = this.options.curr;\r\n//     // 总页数\r\n//     this.pageCount = Math.ceil(this.options.count / this.options.limit);\r\n//     // 渲染\r\n//     this.renderPages();\r\n//     // 执行回调函数\r\n//     this.options.callback && this.options.callback({\r\n//       curr: this.pageNumber,\r\n//       limit: this.options.limit,\r\n//       isFirst: true\r\n//     });\r\n//     // 改变页数并触发事件\r\n//     this.changePage();\r\n//   };\r\n\r\n//   Pagination.prototype = {\r\n//     constructor: Pagination,\r\n//     pageInfos: [{\r\n//         id: \"first\",\r\n//         content: \"首页\"\r\n//       },\r\n//       {\r\n//         id: \"prev\",\r\n//         content: \"前一页\"\r\n//       },\r\n//       {\r\n//         id: \"next\",\r\n//         content: \"后一页\"\r\n//       },\r\n//       {\r\n//         id: \"last\",\r\n//         content: \"尾页\"\r\n//       },\r\n//       {\r\n//         id: \"\",\r\n//         content: \"...\"\r\n//       }\r\n//     ],\r\n//     getPageInfos: function(className, content) {\r\n//       return {\r\n//         id: \"page\",\r\n//         className: className,\r\n//         content: content\r\n//       };\r\n//     },\r\n//     changePage: function() {\r\n//       var self = this;\r\n//       var pageElement = self.pageElement;\r\n//       EventUtil.addEvent(pageElement, \"click\", function(ev) {\r\n//         var e = ev || window.event;\r\n//         var target = e.target || e.srcElement;\r\n//         if (target.nodeName.toLocaleLowerCase() == \"a\") {\r\n//           if (target.id === \"prev\") {\r\n//             self.prevPage();\r\n//           } else if (target.id === \"next\") {\r\n//             self.nextPage();\r\n//           } else if (target.id === \"first\") {\r\n//             self.firstPage();\r\n//           } else if (target.id === \"last\") {\r\n//             self.lastPage();\r\n//           } else if (target.id === \"page\") {\r\n//             self.goPage(parseInt(target.innerHTML));\r\n//           } else {\r\n//             return;\r\n//           }\r\n//           self.renderPages();\r\n//           self.options.callback && self.options.callback({\r\n//             curr: self.pageNumber,\r\n//             limit: self.options.limit,\r\n//             isFirst: false\r\n//           });\r\n//           self.pageHash();\r\n//         }\r\n//       });\r\n//     },\r\n//     pageHash: function() {\r\n//       if (this.options.hash) {\r\n//         window.location.hash = '#!' + this.options.hash + '=' + this.pageNumber;\r\n//       }\r\n//     },\r\n//     renderPages: function() {\r\n//       this.pageElement.innerHTML = \"\";\r\n//       if (this.options.ellipsis) {\r\n//         this.pageElement.appendChild(this.renderEllipsis());\r\n//       } else {\r\n//         this.pageElement.appendChild(this.renderNoEllipsis());\r\n//       }\r\n//     },\r\n//     renderNoEllipsis: function() {\r\n//       var fragment = document.createDocumentFragment();\r\n//       if (this.pageNumber < this.options.pageShow + 1) {\r\n//         fragment.appendChild(this.renderDom(1, this.options.pageShow * 2 + 1));\r\n//       } else if (this.pageNumber > this.pageCount - this.options.pageShow) {\r\n//         fragment.appendChild(this.renderDom(this.pageCount - this.options.pageShow * 2, this.pageCount));\r\n//       } else {\r\n//         fragment.appendChild(this.renderDom(this.pageNumber - this.options.pageShow, this.pageNumber + this.options.pageShow));\r\n//       }\r\n//       if (this.pageNumber > 1) {\r\n//         this.addFragmentBefore(fragment, [\r\n//           this.pageInfos[0],\r\n//           this.pageInfos[1]\r\n//         ]);\r\n//       }\r\n//       if (this.pageNumber < this.pageCount) {\r\n//         this.addFragmentAfter(fragment, [this.pageInfos[2], this.pageInfos[3]]);\r\n//       }\r\n//       return fragment;\r\n//     },\r\n//     renderEllipsis: function() {\r\n//       var fragment = document.createDocumentFragment();\r\n//       this.addFragmentAfter(fragment, [\r\n//         this.getPageInfos(CLASS_NAME.LINK + \" current\", this.pageNumber)\r\n//       ]);\r\n//       for (var i = 1; i <= this.options.pageShow; i++) {\r\n//         if (this.pageNumber - i > 1) {\r\n//           this.addFragmentBefore(fragment, [\r\n//             this.getPageInfos(CLASS_NAME.LINK, this.pageNumber - i)\r\n//           ]);\r\n//         }\r\n//         if (this.pageNumber + i < this.pageCount) {\r\n//           this.addFragmentAfter(fragment, [\r\n//             this.getPageInfos(CLASS_NAME.LINK, this.pageNumber + i)\r\n//           ]);\r\n//         }\r\n//       }\r\n//       if (this.pageNumber - (this.options.pageShow + 1) > 1) {\r\n//         this.addFragmentBefore(fragment, [this.pageInfos[4]]);\r\n//       }\r\n//       if (this.pageNumber > 1) {\r\n//         this.addFragmentBefore(fragment, [\r\n//           this.pageInfos[0],\r\n//           this.pageInfos[1],\r\n//           this.getPageInfos(CLASS_NAME.LINK, 1)\r\n//         ]);\r\n//       }\r\n//       if (this.pageNumber + this.options.pageShow + 1 < this.pageCount) {\r\n//         this.addFragmentAfter(fragment, [this.pageInfos[4]]);\r\n//       }\r\n//       if (this.pageNumber < this.pageCount) {\r\n//         this.addFragmentAfter(fragment, [\r\n//           this.getPageInfos(CLASS_NAME.LINK, this.pageCount),\r\n//           this.pageInfos[2],\r\n//           this.pageInfos[3]\r\n//         ]);\r\n//       }\r\n//       return fragment;\r\n//     },\r\n//     addFragmentBefore: function(fragment, datas) {\r\n//       fragment.insertBefore(this.createHtml(datas), fragment.firstChild);\r\n//     },\r\n//     addFragmentAfter: function(fragment, datas) {\r\n//       fragment.appendChild(this.createHtml(datas));\r\n//     },\r\n//     createHtml: function(elemDatas) {\r\n//       var self = this;\r\n//       var fragment = document.createDocumentFragment();\r\n//       var liEle = document.createElement(\"li\");\r\n//       var aEle = document.createElement(\"a\");\r\n//       elemDatas.forEach(function(elementData, index) {\r\n//         liEle = liEle.cloneNode(false);\r\n//         aEle = aEle.cloneNode(false);\r\n//         liEle.setAttribute(\"class\", CLASS_NAME.ITEM);\r\n//         aEle.setAttribute(\"href\", \"javascript:;\");\r\n//         aEle.setAttribute(\"id\", elementData.id);\r\n//         if (elementData.id !== 'page') {\r\n//           aEle.setAttribute(\"class\", CLASS_NAME.LINK);\r\n//         } else {\r\n//           aEle.setAttribute(\"class\", elementData.className);\r\n//         }\r\n//         aEle.innerHTML = elementData.content;\r\n//         liEle.appendChild(aEle);\r\n//         fragment.appendChild(liEle);\r\n//       });\r\n//       return fragment;\r\n//     },\r\n//     renderDom: function(begin, end) {\r\n//       var fragment = document.createDocumentFragment();\r\n//       var str = \"\";\r\n//       for (var i = begin; i <= end; i++) {\r\n//         str = this.pageNumber === i ? CLASS_NAME.LINK + \" current\" : CLASS_NAME.LINK;\r\n//         this.addFragmentAfter(fragment, [this.getPageInfos(str, i)]);\r\n//       }\r\n//       return fragment;\r\n//     },\r\n//     prevPage: function() {\r\n//       this.pageNumber--;\r\n//     },\r\n//     nextPage: function() {\r\n//       this.pageNumber++;\r\n//     },\r\n//     goPage: function(pageNumber) {\r\n//       this.pageNumber = pageNumber;\r\n//     },\r\n//     firstPage: function() {\r\n//       this.pageNumber = 1;\r\n//     },\r\n//     lastPage: function() {\r\n//       this.pageNumber = this.pageCount;\r\n//     }\r\n//   };\r\n//   return Pagination;\r\n// });\r\nclass Person{\r\n  constructor(name, age){\r\n    this.name = name;\r\n    this.age = age;\r\n  }\r\n\r\n  say(){\r\n    return `我是${this.name},我今年${this.age}岁了。`;\r\n  }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Person);\n\n//# sourceURL=webpack:///./src/pagination/pagination.js?");

/***/ })

/******/ });