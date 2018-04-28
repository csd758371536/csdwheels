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

配置分页，支持两种分页类型

1、不显示省略号：
```js
var pageOption = {
  // 数据总数（必填）
  dataCount: 162,
  // 分页类型（必填）
  pageType: 1,
  // 每页最多显示的数据数量（选填，默认5个）
  pageSize: 7,
  // 界面最多能显示的页码数量（选填，默认5个）
  pageMax: 5,
  // 回调事件（选填，参数必填，值为当前页码）
  pageEvent: function(pageNumber) {}
};
var page =  new Page(pageOption);
```

2、显示省略号
```js
var pageOption = {
  // 数据总数（必填）
  dataCount: 162,
  // 分页类型（必填）
  pageType: 2,
  // 每页最多显示的数据数量（选填，默认5个）
  pageSize: 7,
  // 当前页码前后最多显示的页码数量（选填，默认2个）
  pageShow: 2,
  // 回调事件（选填，参数必填，值为当前页码）
  pageEvent: function(pageNumber) {}
};
var page =  new Page(pageOption);
```


#### 效果演示

test/page/test.html

## 3. 测试

> npm install

> npm test


## 4. 协议

MIT
