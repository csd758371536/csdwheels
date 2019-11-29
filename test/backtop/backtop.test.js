const Nightmare = require('nightmare');
const chai = require('chai');

chai.should();

//初始化Nightmare对象
const nightmare = new Nightmare({
  show: true, //是否显示图形化界面
});

describe('backtop test', function() {
  it('http connection', function(done) {
    nightmare
      .goto('http://127.0.0.1:3000/backtop') //打开某网页
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
