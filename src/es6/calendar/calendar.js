class Calendar {
  constructor(options = {}) {
    this.options = {};
    Object.assign(this.options, options);
    this.init(options);
  }

  init(options) {
    console.log('这是日历插件！');
    // this._doSometing(options.elem);
  }
}

export default Calendar;
