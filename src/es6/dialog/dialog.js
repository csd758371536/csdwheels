class Dialog {
  constructor(options = {}) {
    this.options = {};
    Object.assign(this.options, options);
    this.init(options);
  }

  init(options) {
    console.log('这是弹窗插件！');
    // this._doSometing(options.elem);
  }
}

export default Dialog;
