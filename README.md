# csdwheels

> 造轮子！造轮子！

[![Build Status](https://travis-ci.org/csd758371536/csdwheels.svg?branch=master)](https://travis-ci.org/csd758371536/csdwheels) [![npm](https://img.shields.io/npm/v/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/dt/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/l/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels)


## 安装

支持npm或bower

> npm install csdwheels --save-dev

> bower install csdwheels --save

然后引入某个插件的css、js文件，并且插入dom结构

例：
```html
<ol class="page-navigator" id="pagelist"></ol>

<link rel="stylesheet" href="pagination.min.css">
<script type="text/javascript" src="pagination.min.js"></script>
```

最后就能使用某个插件了


## 使用

### 分页

#### 初始化

引入css、js
```html
<link rel="stylesheet" href="pagination.min.css">
<script type="text/javascript" src="pagination.min.js"></script>
```

插入dom
```html
<ol class="page-navigator" id="pagelist"></ol>
```

配置说明
```js
// 分页元素ID（必填）
var selector = 'pagelist';

// 分页配置（必填）
var pageOption = {
  // 每页最多显示的数据数量（必填）
  pageSize: 5,
  // 是否显示省略号（选填，默认显示）
  ellipsis: true,
  // 当前页前后两边可显示的页码个数（选填，默认为2）
  pageShow: 2
};
// 回调事件（必填，接收两个参数：1、当前页码，2、每页最多显示的数据数量）
var callback = function(pageNumber, pageSize) {}

// 数据总数（必填）
var dataCount = 162;

// 当前页码（必填）
var pageNumber = 1;

// 初始化分页器
var page =  new Pagination(selector, pageOption, callback);
page.initPage(dataCount, pageNumber)
```

#### 使用场景

##### 前端分页

在`callback`回调函数里对总数据进行处理，然后取出当前页需要展示的数据即可

##### 后端分页

在页面初始化时将url上的页码参数取得，调用后端的接口，获取当前页的数据，然后在页面初始化方法里调用一次`initPage`方法
在`callback`回调函数里取得当前页码，然后将当前页码作为url参数，最后进行页面跳转（如果是单页应用就直接改变路由参数，如果是多页需要在链接后面带上参数）

#### 效果演示

test/pagination/test.html

## 测试

> npm install

> npm test


## 协议

MIT
