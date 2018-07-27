# csdwheels

日常工作中经常会发现有大量业务逻辑是重复的，而用别人的插件和轮子也不能完美解决一些定制化的需求，所以我抽取出来了这套插件库，希望能让大家提升工作效率，少加班~

> 目前项目使用 ES5及UMD 规范封装，所以在前端暂时只支持<script>标签的引入方式，未来计划会逐步用 ES6 重构，并且使用 Webpack 等工具来支持模块化的引入及按需加载

[![Build Status](https://travis-ci.org/csdoker/csdwheels.svg?branch=master)](https://travis-ci.org/csdoker/csdwheels) [![npm](https://img.shields.io/npm/v/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/dt/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/l/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels)

项目地址：[https://project.csdoker.com/csdwheels](https://project.csdoker.com/csdwheels)

## 版本说明

- ES5：`src/es5`文件下为ES5版本源码，ES5语法 + UMD（dist文件下为打包压缩后的代码）
- ES6：`src/es6`文件下为ES6版本源码，打包后支持ES5语法 + UMD + ES6的导入方式（dist-es6文件下为打包压缩后的代码）

## 安装插件

> npm install csdwheels --save-dev

## 引入方式

### ES5

在`dist`文件目录下，找到某个插件的css、js文件，然后将它们引入HTML文档中，并添加插件的DOM结构：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="author" content="csdoker">
  <title>pagination</title>
  <link rel="stylesheet" href="pagination.min.css">
</head>
<body>
  <ol class="page-navigator" id="pagelist"></ol>
  <script type="text/javascript" src="pagination.min.js"></script>
</body>
</html>
```

### ES6

> ES6版本使用之前必须先使用命令安装对应的npm包

因为样式已打包进`dist-es6`目录下的源码中，所以只需要添加插件的DOM结构，然后在你的JS文件中使用`import`引入插件即可：
```html
<html>
<head>
  <meta charset="UTF-8">
  <meta name="author" content="csdoker">
  <title>pagination</title>
</head>
<body>
  <ol class="page-navigator" id="pagelist"></ol>
  <script src="./test.js"></script>
</body>
</html>
```

```javascript
// test.js

// 安装npm包后，直接引入对应的插件
import Plugin from 'csdwheels';
```

## 使用说明

### 分页

#### 初始化

```html
<ol class="page-navigator" id="pagelist"></ol>
```

```js
// 分页元素ID（必填）
var selector = '#pagelist';

// 分页配置
var pageOption = {
  // 每页显示数据条数（必填）
  limit: 5,
  // 数据总数（一般通过后端获取，必填）
  count: 162,
  // 当前页码（选填，默认为1）
  curr: 1,
  // 是否显示省略号（选填，默认显示）
  ellipsis: true,
  // 当前页前后两边可显示的页码个数（选填，默认为2）
  pageShow: 2,
  // 开启location.hash，并自定义hash值 （默认关闭）
  // 如果开启，在触发分页时，会自动对url追加：#!hash值={curr} 利用这个，可以在页面载入时就定位到指定页
  hash: false,
  // 页面加载后默认执行一次，然后当分页被切换时再次触发
  callback: function(obj) {
    // obj.curr：获取当前页码
    // obj.limit：获取每页显示数据条数
    // obj.isFirst：是否首次加载页面，一般用于初始加载的判断

    // 首次不执行
    if (!obj.isFirst) {
      // do something
    }
  }
};

// 初始化分页器
new Pagination(selector, pageOption);
```

#### 使用场景

> 此分页器只负责分页本身的逻辑，具体的数据请求与渲染需要另外去完成

> 此分页器不仅能应用在一般的异步分页上，还可直接对一段已知数据进行分页展现，更可以取代传统的超链接分页

前端分页：

在`callback`里对总数据进行处理，然后取出当前页需要展示的数据即可

后端分页：

利用url上的页码参数，可以在页面载入时就定位到指定页码，并且可以同时请求后端指定页码下对应的数据
在`callback`回调函数里取得当前页码，可以使用`window.location.href`改变url，并将当前页码作为url参数，然后进行页面跳转，例如"./test.html?page="

#### 效果演示

[pagination](https://csdoker.github.io/csdemos/pagination/)

## 测试

> npm install

> npm test

## 协议

MIT
