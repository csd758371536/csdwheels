# csdwheels

> 造轮子！造轮子！

[![Build Status](https://travis-ci.org/csd758371536/csdwheels.svg?branch=master)](https://travis-ci.org/csd758371536/csdwheels) [![npm](https://img.shields.io/npm/v/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/dt/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/l/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels)


## 1. 安装

支持npm或bower

> npm install csdwheels --save-dev

> bower install csdwheels --save

然后引入某个插件的css、js文件，并且插入dom结构

例：
```html
<ol class="page-navigator" id="pagelist"></ol>

<link rel="stylesheet" href="page.min.css">
<script type="text/javascript" src="page.min.js"></script>
```

最后就能使用某个插件了


## 2. 使用

### 分页

#### 初始化

引入css、js
```html
<link rel="stylesheet" href="page.min.css">
<script type="text/javascript" src="page.min.js"></script>
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
var page =  new Page(selector, pageOption, callback);
page.initPage(dataCount, pageNumber)
```

#### 效果演示

test/page/test.html

## 3. 测试

> npm install

> npm test


## 4. 协议

MIT
