const Nightmare = require('nightmare');
const chai = require('chai');

chai.should();

//初始化Nightmare对象
const nightmare = new Nightmare({
  show: true, //是否显示图形化界面
  openDevTools: {
    //配置此项后可显示开发者工具，不配置即不显示
    mode: 'detach',
  },
});

describe('pagination test', function() {
  this.timeout(5000);
  it('http connection', function(done) {
    nightmare
      .goto('http://127.0.0.1:3000/pagination') //打开某网页
      .then(() => {
        done();
      }) //成功后调done执行结果
      .catch(err => {
        {
          console.warn('加载出错', err);
          done(err);
        }
      }); //出错执行什么
  });
});
