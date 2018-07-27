// 引入样式

class Pagination {
  constructor(options = {}) {
    this.options = {};
    Object.assign(this.options, options);
    this.init(options);
  }

  init(options) {
    console.log('这是分页插件！');
    // this._doSometing(options.elem);
  }
}

export default Pagination;
