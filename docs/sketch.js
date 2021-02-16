let uNet;
let myMask;
let handpose;
let handResult;

let video;

let thumbsupCount = 0;
let fingerNumberCount = [0, 0, 0, 0, 0, 0];

function setup() {
  frameRate(30);
  uNet = ml5.uNet('face');

  let url = location.search;
  console.log('start');
  console.log(url);

  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('myCanvas');

  // load up your video
  video = createCapture(VIDEO, () => {
    // マスク
    // uNet.segment(video, unetResult);
    function unetResult(error, result) {
      if (error) {
        console.error(error);
        return;
      }
      myMask = result.backgroundMask;
      uNet.segment(video, unetResult);
    }

    // 手検出
    handpose = ml5.handpose(video, () => {
      console.log('Model Loaded!');
    });
    handpose.on('predict', result => {
      handResult = result;
    });
  });
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
}

function draw() {
  background(255);

  image(video, 0, 0, width, height);
  if (myMask) {
    image(myMask, 0, 0, width, height);
  }

  if (handResult && handResult[0]) {

    // drawHand(handResult[0]);

    if (isThumbsup(handResult[0])) {
      thumbsupCount++;
      // console.log('thumbs up count:' + thumbsupCount);
    }
    else {
      thumbsupCount = 0;

      let fingerNum = getNumbersWithFingers(handResult[0]);
      for (let i = 0; i < 6; i++) {
        if (i == fingerNum) {
          fingerNumberCount[i]++;
          if (fingerNumberCount[i] > 30) {
            setTime(i * 60); // index.htmlの関数呼び出し todo
          }
        }
        else {
          fingerNumberCount[i] = 0;
        }
      }
    }
    if (thumbsupCount > 30) {
      thumbsupCount = -1000;

      clickStartButton(); // index.htmlの関数呼び出し todo
    }
  }
}

// function mousePressed() {
//   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
//     let fs = fullscreen();
//     fullscreen(!fs);
//   }
// }

function drawHand(hand) {
  const landmarks = hand.landmarks;
  // 骨
  strokeWeight(2);
  noFill();
  stroke(255);
  for (let i = 0; i < 5; i++) {
    beginShape();
    // vertex(landmarks[0][0], landmarks[0][1], landmarks[0][2]);//付け根から
    // for (let j = 0; j < 4; j++) {
    //   const ind = i * 4 + 1 + j;
    //   vertex(landmarks[ind][0], landmarks[ind][1], landmarks[ind][2]);
    // }
    vertex(landmarks[0][0], landmarks[0][1]);//付け根から
    for (let j = 0; j < 4; j++) {
      const ind = i * 4 + 1 + j;
      vertex(landmarks[ind][0], landmarks[ind][1]);
    }
    endShape();
  }

  // 数字
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  for (let i = 0; i < landmarks.length; i++) {
    // 3D loadFontなども必要
    // push();
    // translate(landmarks[i][0], landmarks[i][1], landmarks[i][2]);
    // text(i, 0, 0);
    // pop();

    //2D
    text(i, landmarks[i][0], landmarks[i][1]);
  }
}

function isThumbsup(hand) {
  const anno = hand.annotations;

  if (anno.thumb[3][1] < anno.thumb[2][1]
    && anno.palmBase[0][0] < anno.pinky[0][0]
    && anno.indexFinger[3][0] < anno.indexFinger[2][0]) {
    return true;
  }
  return false;
}

function getNumbersWithFingers(hand) {
  const annotations = hand.annotations;

  let number = 0;
  // 右手限定
  // 親指が立っているかどうか
  if (annotations.thumb[3][0] > annotations.thumb[2][0]) {
    number++;
  }

  if (annotations.indexFinger[3][1] < annotations.indexFinger[2][1]) {
    number++;
  }
  if (annotations.middleFinger[3][1] < annotations.middleFinger[2][1]) {
    number++;
  }
  if (annotations.ringFinger[3][1] < annotations.ringFinger[2][1]) {
    number++;
  }
  if (annotations.pinky[3][1] < annotations.pinky[2][1]) {
    number++;
  }

  return number;
}



