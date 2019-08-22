const GAME_FPS = 1000/60;  //FPS
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.Width  = SCREEN_SIZE_W;
vcan.Height = SCREEN_SIZE_H;

can.Width  = SCREEN_SIZE_W*3;
can.Height = SCREEN_SIZE_H*3;

con.mozimageSmoothingEnabled    = false;
con.msimageSmoothingEnabled     = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled       = false;
//フレームレート維持
let frameCount = 0;
let statTime;

let chImg = new Image();
chImg.src = "1.png";
// chImg.onload = draw;

//キーボード情報
let keyb = {};

//おじさん情報
//座標
let oji_x = 100<<4;
let oji_y = 100<<4;
let oji_vx = 0;
let oji_vy = 0;
let oji_anime = 0;
let oji_sprite = 48;
let oji_acount = 0;
let oji_dir = 0;
let oji_jump = 0;

//更新処理
function update(){
  //アニメ用のカウンタ
  oji_acount++;
  if(Math.abs(oji_vx)==32) oji_acount++;

  //ジャンプ
  if (keyb.ABUTTON) {
    if (oji_jump == 0) {
      oji_jump =1;
      oji_vy = -32;
    }
  }

  //重力
  if(oji_vy < 32) oji_vy++;

  //床にぶつかる
  if (oji_y > 150<<4) {
    oji_jump = 0;
    oji_vy = 0;
    oji_y = 150<<4;
  }

  if (keyb.Left){
    if(oji_anime == 0)oji_acount = 0;
        oji_anime = 1;
        oji_dir   = 1;
       if(oji_vx > -32)oji_vx-=1;
       if(oji_vx > 0)oji_vx -= 1;
       if(oji_vx > 8)oji_anime = 2;
  }else if (keyb.Right){
    if(oji_anime == 0)oji_acount = 0;
        oji_anime = 1;
        oji_dir   = 0;
        oji_sprite = 0;
       if(oji_vx < 32)oji_vx+=1;
       if(oji_vx < 0)oji_vx += 1;
       if(oji_vx < -8)oji_anime = 2;
  }else {
        if(oji_vx > 0)oji_vx -= 1;
        if(oji_vx < 0)oji_vx += 1;
        if(!oji_vx) oji_anime = 0;
  }

  //スプライトの決定
  if (oji_anime == 0) oji_sprite = 0;
  else if (oji_anime == 1) oji_sprite = 2+((oji_acount/6)%3);
  else if (oji_anime == 2) oji_sprite = 5;

  //左向きの時は+48を使う
   if (oji_dir) oji_sprite += 48;

   //実際に座標を変えてる
  oji_x += oji_vx;
  oji_y += oji_vy;
};

// スプライトの描画
function drawSprite(snum,x,y){
  let sx = (snum&15)*16;
  let sy = (snum>>4)*16;
  vcon.drawImage(chImg,sx,sy,16,32,x,y,16,32);
}

//描画処理
function draw(){
  //画面を水色でクリア
  vcon.fillStyle = "#66aaff";
  vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);

  //おじさんを表示
  drawSprite(oji_sprite,oji_x>>4,oji_y>>4);

  //デバッグ情報を表示
  vcon.font = "24px 'Impact'";
  vcon.fillStyle = "#fff";
  vcon.fillText("FRAME:"+frameCount,10,20);

  //仮想画面から実画面へ拡大転送
  con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H,
      0,0,SCREEN_SIZE_W*3,SCREEN_SIZE_H*3);
};

// setInterval(mainLoop,1000/60);

//メインループ開始
window.onload = function(){
  startTime = performance.now();
  mainLoop();
}

function mainLoop(){
  let nowTime = performance.now();
  let nowFrame = (nowTime - startTime)/GAME_FPS;

  if (nowFrame > frameCount) {
    let c = 0;
    while(nowFrame > frameCount){
      frameCount++;

      //更新処理
      update();
      if (++c >= 4) break;
    }

    //描画処理
    draw();
  }
  requestAnimationFrame(mainLoop);
}

//キーボードが押されたとき
document.onkeydown = function(e){
  if (e.keyCode == 37) keyb.Left = true;
  if (e.keyCode == 39) keyb.Right = true;
  if (e.keyCode == 90) keyb.BBUTTON = true;
  if (e.keyCode == 88) keyb.ABUTTON = true;
}
//キーボードが離されたとき
document.onkeyup = function(e){
  if (e.keyCode == 37) keyb.Left = false;
  if (e.keyCode == 39) keyb.Right = false;
  if (e.keyCode == 90) keyb.BBUTTON = false;
  if (e.keyCode == 88) keyb.ABUTTON = false;
}
