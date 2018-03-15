# csdwheels

> 造轮子！造轮子！

[![Build Status](https://travis-ci.org/csd758371536/csdwheels.svg?branch=master)](https://travis-ci.org/csd758371536/csdwheels) [![npm](https://img.shields.io/npm/v/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/dt/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels) [![npm](https://img.shields.io/npm/l/csdwheels.svg?style=flat-square)](https://www.npmjs.com/package/csdwheels)


## 1. 安装

支持npm或bower

> npm install csdwheels --save-dev

> bower install csdwheels --save

然后引入某个插件的css及js文件

```html
<link rel="stylesheet" href="page.min.css">
<script type="text/javascript" src="page.min.js"></script>
```

最后就能使用某个插件了

```js
var pageOption = {
  dataCount: 162,
  pageSize: 7,
  pageMax: 5
};
var page =  new Page(pageOption);
```


## 2. 使用

### 分页

#### 初始化

支持三个参数：

```js
var pageOption = {
  // 数据总数（必填）
  dataCount: 162,
  // 每页最多显示的数据数量（必填）
  pageSize: 7,
  // 界面最多能显示的页码数量（必填）
  pageMax: 5
};
var page =  new Page(pageOption);
```

#### 绑定事件

```js
page.pageEvent = function () {
  document.getElementById('content').innerHTML = this.pageNumber;
};
```

可以给分页按钮绑定对应的事件（比如上面这段代码就打印了当前页码）

#### 效果演示

test/page/test.html

## 3. 测试

> npm install

> npm test


## 4. 协议

MIT
