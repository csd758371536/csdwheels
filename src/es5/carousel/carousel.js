var wrap = document.querySelector(".wrap");
var next = document.querySelector(".arrow_right");
var prev = document.querySelector(".arrow_left");
next.onclick = function() {
  next_pic();
};
prev.onclick = function() {
  prev_pic();
};
function next_pic() {
  index++;
  if (index > 4) {
    index = 0;
  }
  showCurrentDot();
  var newLeft;
  if (wrap.style.left === "-3600px") {
    newLeft = -1200;
  } else {
    newLeft = parseInt(wrap.style.left) - 600;
  }
  wrap.style.left = newLeft + "px";
}
function prev_pic() {
  index--;
  if (index < 0) {
    index = 4;
  }
  showCurrentDot();
  var newLeft;
  if (wrap.style.left === "0px") {
    newLeft = -2400;
  } else {
    newLeft = parseInt(wrap.style.left) + 600;
  }
  wrap.style.left = newLeft + "px";
}
var timer = null;
function autoPlay() {
  timer = setInterval(function() {
    next_pic();
  }, 2000);
}
autoPlay();
var container = document.querySelector(".container");
container.onmouseenter = function() {
  clearInterval(timer);
};
container.onmouseleave = function() {
  autoPlay();
};
var index = 0;
var dots = document.getElementsByTagName("span");
function showCurrentDot() {
  for (var i = 0, len = dots.length; i < len; i++) {
    dots[i].className = "";
  }
  dots[index].className = "on";
}
for (var i = 0, len = dots.length; i < len; i++) {
  (function(i) {
    dots[i].onclick = function() {
      var dis = index - i;
      if (index == 4 && parseInt(wrap.style.left) !== -3000) {
        dis = dis - 5;
      }
      //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
      if (index == 0 && parseInt(wrap.style.left) !== -600) {
        dis = 5 + dis;
      }
      wrap.style.left = parseInt(wrap.style.left) + dis * 600 + "px";
      index = i;
      showCurrentDot();
    };
  })(i);
}
