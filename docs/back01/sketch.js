let uNet;
let myMask;
let handpose;
let handResult;

let timer;

let handNumber = -1;

function setup() {
  uNet = ml5.uNet('face');

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
    // uNet.segment(video, unetResult);
    handpose = ml5.handpose(video, () => {
      console.log('Model Loaded!');
    });
    handpose.on('predict', handposeResult);
  });
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas

  function unetResult(error, result) {
    if (error) {
      console.error(error);
      return;
    }
    myMask = result.backgroundMask;
    uNet.segment(video, unetResult);
  }
  function handposeResult(result) {
    console.log(result);
    if (result[0]) {
      handNumber = getNumbersWithFingers(result[0].landmarks);
    }
    else {
      handNumber = -1;
    }
    console.log(handNumber);
  }
}

function drawHand(landmarks) {
  for (let i = 0; i < landmarks.length; i++) {

  }
}

// handposeの結果から、伸ばしている指の数を返す
// 注) 例えば、親指だけ伸ばしているときも1と返す
function getNumbersWithFingers(landmarks) {
  let bendFingersNum = 0;

  // 各指の第一関節のインデックス
  const fingerIndex = [3, 7, 11, 15, 19];

  let counter = 0;
  for (let i = 0; i < landmarks.length; i++) {
    if (i == fingerIndex[counter]) {
      // 第一関節
      let [jx, jy, jz] = landmarks[i];
      // 指先
      let [tx, ty, tz] = landmarks[i + 1];

      // console.log('jy: ' + jy + ', ty:' + ty);

      stroke(255, 0, 0);
      strokeWeight(3);
      line(jx, jy, tx, ty);
      ellipse(tx, ty, 5);
      // 曲げている数を取得
      // 親指
      if (i == 0 && ) {
      }
      if (ty > jy) {
        bendFingersNum++;
      }
      counter++;
    }
  }

  return 5 - bendFingersNum;
}

function draw() {
  background(255);

  // console.log(timer.second, timer.minute);
  timer.setPosition(width / 2, height / 4);
  timer.setSize(150);
  // timer.display();

  // if (myMask) {
  //   image(myMask, 0, 0, width, height);
  // }
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
