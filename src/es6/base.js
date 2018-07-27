// ES6 插件模板
class Plugin {
  constructor(options = {}) {
    this.options = {};
    Object.assign(this.options, options);
    this.init(options);
  }

  init(options) {
    this._doSometing(options.elem);
  }
}

export default Plugin;
