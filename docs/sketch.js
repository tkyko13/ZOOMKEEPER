let uNet;
let myMask;

let timer;

function preload() {
  uNet = ml5.uNet('face');
}

function setup() {

  timer = new TimerViewer();

  let url = location.search;
  console.log('start');
  console.log(url);

  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');

  // const input = createInput('');
  // input.elt.type = 'number';
  // input.input(() => {
  //   timer.second = input.value();
  // });
  // const startBtn = createButton('start');
  // startBtn.mousePressed(() => {
  //   timer.start();
  // });

  // load up your video
  const video = createCapture(VIDEO, () => {
    uNet.segment(video, gotResult);
  });
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
  function gotResult(error, result) {
    if (error) {
      console.error(error);
      return;
    }
    myMask = result.backgroundMask;
    uNet.segment(video, gotResult);
  }
}

function draw() {
  background(255);

  // console.log(timer.second, timer.minute);
  timer.setPosition(width / 2, height / 4);
  timer.setSize(150);
  // timer.display();

  if (myMask) {
    image(myMask, 0, 0, width, height);
  }
}

class Timer {
  constructor() {
    this.mSec = 0;
    this.sec = 0;
    this.min = 0;
    this.timer = null;
  }

  set minute(min) {
    this.min = parseInt(min);
  }
  get minute() {
    return this.min;
  }
  set second(sec) {
    this.sec = parseInt(sec);
  }
  get second() {
    return this.sec;
  }

  start() {
    this.timer = setInterval(() => {
      this.countDown();
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  countDown() {
    if ((this.min == 0) && (this.sec == 0)) {
      // reSet();
      // finish
    }
    else {
      if (this.sec == 0) {
        this.min--;
        this.sec = 60;
      }
      this.sec--;
    }
  }
}

class TimerViewer extends Timer {
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  setSize(size) {
    this.size = size;
  }
  display() {
    fill(0);
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.min + ' : ' + this.sec, this.x, this.y);
  }
}
