var sketch = function(p) {
  var pix, width, height, hw, hh, mode, magn, z1, z2, w1, w2, thr1, thr2, n, par, buffer, info, auto, img, imgMode;

  p.setup = function() {
    p.createCanvas(500,500);
    p.textSize(25);  p.strokeWeight(1);
    pix = p.width*p.height;  hw = p.width/2;  hh = p.height/2;
    info = false;  auto = true;
    mode = (auto) ? 4 : 3;  if (!auto) p.noLoop();
    magn = 200;  thr1 = 10;  thr2 = 0.1;  n = 0;
    par = [];  buffer = new Array(pix*4).fill(255);
    for (var i = 0; i < 4; i++) par[i] = [];
    //img = p.loadImage('https://i.imgur.com/MrGY5EL.jpg');  imgMode = false;
    par_reset();  p.pixelDensity(1);
    p.loadPixels();  //img.loadPixels();
  }

  p.draw = function() {
    //var col = [];  for (var i = 1; i < 4; i++) col[i-1] = 255*p.noise(i*n);
    var col = [0,200,0];
    p.background(0);  p.stroke(col);
    for (var i = 0; i < p.width; i += p.width/20) p.line(i,0,i,p.height);
    for (var j = 0; j < p.height; j += p.height/20) p.line(0,j,p.width,j);

    p.get();
    var alpha, beta, gamma, delta, sumSq, mz1, mz2, index1, index2, is0;
    for (var i = 0; i < p.width; i++) {
      w1 = i-hw;
      for (var j = 0; j < p.height; j++) {
        w2 = j-hh;
        alpha = par[1][0] - par[3][0]*w1 + par[3][1]*w2;
        beta = par[1][1] - par[3][0]*w2 - par[3][1]*w1;
        gamma = par[2][0]*w1 - par[2][1]*w2 - par[0][0];
        delta = par[2][0]*w2 + par[2][1]*w1 - par[0][1];
        sumSq = p.sq(gamma) + p.sq(delta);
        if (sumSq == 0) sumSq = 0.00001;
        z1 = (alpha*gamma + beta*delta) / sumSq;
        z2 = (beta*gamma - alpha*delta) / sumSq;
        mz1 = p.round((magn*z1)%p.width);
        mz2 = p.round((magn*z2)%p.height);
        mz1 = (mz1 < 0) ? p.width+mz1 : mz1;
        mz2 = (mz2 < 0) ? p.height+mz2 : mz2;
        index1 = (i+j*p.width)*4;  index2 = (mz1+mz2*p.width)*4;
        if (p.pixels[index2]+p.pixels[index2+1]+p.pixels[index2+2] != 0) is0 = false;
        else is0 = true;
        if (is0) {
          for (var k = 0; k < 3; k++) buffer[index1+k] = 0;
        } else { for (var k = 0; k < 3; k++) buffer[index1+k] = col[k]; }
      }
    }
    for (var i = 0; i < pix*4; i++) p.pixels[i] = buffer[i];
    p.updatePixels();
    
    if (info) {
      text("a: " + p[0][0] + ", " + p[0][1] + 'i',25,25);
      text("b: " + p[1][0] + ", " + p[1][1] + 'i',25,50);
      text("c: " + p[2][0] + ", " + p[2][1] + 'i',25,75);
      text("d: " + p[3][0] + ", " + p[3][1] + 'i',25,100);
    }
  
    n += 0.01;
    if (auto) { par[3][0] += 0.0001;  par[3][1] += 0.0001; }
  }

  p.mouseMoved = function() {
    if (mode < 2) {
      par[mode][0] = p.map(p.mouseX,0,p.width,-thr1,thr1);
      par[mode][1] = p.map(p.mouseY,0,p.height,-thr1,thr1);
    } else if (mode < 4) {
      par[mode][0] = p.map(p.mouseX,0,p.width,-thr2,thr2);
      par[mode][1] = p.map(p.mouseY,0,p.height,-thr2,thr2);
    }
    p.redraw();
  }

  //swap = function() { imgMode = (imgMode) ? false : true; }

  /*
  p.keyPressed = function() {
    mode = 4;
    for (var i = 0; i < 4; i++) {
      if (key == char(i + 1 + '0')) mode = i;
    }
    if (key == 'r') { p_reset();  mode = 3; }
  }
*/
  par_reset = function() {
    par[0][0] = 0;  par[0][1] = 0;  par[1][0] = 0;  par[1][1] = -4;
    par[2][0] = -0.05;  par[2][1] = 0;  par[3][0] = 0.0027;  par[3][1] = 0.025;
  }
}