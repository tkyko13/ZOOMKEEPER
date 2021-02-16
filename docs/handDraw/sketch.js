let handpose;
let handResult;

let video;

const DRAW_HANDS = true;

function setup() {
  frameRate(10);

  createCanvas(windowWidth, windowHeight);

  // 3D
  // const cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  // cnv.position(-width / 2, -height / 2);

  // setup video
  video = createCapture(VIDEO, () => {
    handpose = ml5.handpose(video, () => {
      console.log('Model Loaded!');
    });
    handpose.on('predict', result => {
      handResult = result;
    });
  });
  // video.size(width, height);
  video.hide();
}

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

  // if (annotations.indexFinger[3][1] < annotations.indexFinger[2][1]) {
  //   number++;
  // }
  // if (annotations.middleFinger[3][1] < annotations.middleFinger[2][1]) {
  //   number++;
  // }
  // if (annotations.ringFinger[3][1] < annotations.ringFinger[2][1]) {
  //   number++;
  // }
  // if (annotations.pinky[3][1] < annotations.pinky[2][1]) {
  //   number++;
  // }
}

function getFingerNumber(hand) {
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


  // ちゃんと計算しようとしたけど逆にだめだったので
  // let number = 0;
  // let mess = '';

  // // 各指の曲がり具合
  // const thumbGrab = getGrabFinger(annotations.thumb);
  // if (-0.2 > thumbGrab) { number++; mess += 'thumb stand'; }

  // const indexFingerGrab = getGrabFinger(annotations.indexFinger);
  // if (-0.2 > indexFingerGrab) { number++; mess += 'indexFinger starnd'; }

  // const middleFingerGrab = getGrabFinger(annotations.middleFinger);
  // if (-0.2 > middleFingerGrab) { number++; mess += 'middleFinger stand'; }

  // const ringFingerGrab = getGrabFinger(annotations.ringFinger);
  // if (-0.2 > ringFingerGrab) { number++; mess += 'ringFinger stand'; }

  // const pinkyGrab = getGrabFinger(annotations.pinky);
  // console.log(pinkyGrab)
  // if (0 > pinkyGrab) { number++; mess += 'pinky stand'; }

  // // console.log(mess);

  // return number;
}

// 指の曲がり具合を取得
// function getGrabFinger(fingerArray) {
//   if (fingerArray.length != 4) {
//     console.error('Figer Array length is not 4');
//     return null;
//   }

//   // 第二関節から、先端と付け根の角度を計算
//   const rootVec = createVector(fingerArray[0][0], fingerArray[0][1], fingerArray[0][2]);
//   const joinVec = createVector(fingerArray[1][0], fingerArray[1][1], fingerArray[1][2]);
//   const tipVec = createVector(fingerArray[3][0], fingerArray[3][1], fingerArray[3][2]);

//   return rootVec.angleBetween(tipVec);
// }

function draw() {
  // background(255);
  if (video) {
    image(video, 0, 0);
  }

  if (handResult && handResult[0]) {
    // 手が画面内に写っている
    // いったん片手だけ描画
    if (DRAW_HANDS) drawHand(handResult[0]);

    textSize(30);
    text(getFingerNumber(handResult[0]), 100, 100);

    if (isThumbsup(handResult[0])) {
      text('b', 150, 100);
    }

  }
}
