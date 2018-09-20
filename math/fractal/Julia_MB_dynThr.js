var sketch = function(p) {  

  var xmin, xmax, offset, ymin, ymax, escThr, imax, maxIter, adj, col;

  p.setup = function() {
    p.createCanvas(1200,480);
    imax = p.floor(p.height*5/2);
    xmin = -2.2;  xmax = 0.7;
    ymin = -1.3;  ymax = 1.3;
    offset = -(xmin+xmax)/2;
    maxIter = 50;  escThr = 3;
    adj = false;
    col = [[255,maxIter/2,maxIter/6],[150,maxIter/2,maxIter/10],[35,maxIter/8,maxIter/20]];
    p.noLoop();  p.pixelDensity(1);
    p.loadPixels();  drawMB();
  }

  p.draw = function() {
    var x, y, xj, yj, t, mx, my, cxmin, cxmax, n;
    mx = p.map(p.mouseX,0,p.height,-2.2,0.7);
    my = p.map(p.mouseY,p.height,0,-1.3,1.3);
    cxmin = (xmin+offset)*1.5;  cxmax = (xmax+offset)*1.5;
    for(var i = p.height; i < imax; i++) {
      x = p.map(i,p.height,imax,cxmin,cxmax);
      for(var j = 0; j < p.height; j++) {
        y = p.map(j,p.height,0,ymin*1.2,ymax*1.2);
        xj = x;  yj = y;  n = 0;
        while (n < maxIter) {
          t = xj;  xj = p.pow(xj,2)-p.pow(yj,2)+mx;  yj = 2*t*yj+my;
          if (p.sqrt(p.sq(xj)+p.sq(yj)) > escThr) break;
          n++;
        }
        var index = (i+j*p.width)*4;
        for (var k = 0; k < 3; k++) {
          // Gaussian distribution (col[k][0] = max, col[k][1] = offset, col[k][2] = width)
          p.pixels[index+k] = col[k][0]*p.exp(-p.sq(n-col[k][1])/(2*p.sq(col[k][2])));
        }
        p.pixels[index+3] = 255;
      }
    }
    p.updatePixels();
  }

  drawMB = function() {
    var x, y, a, b, t, n;
    for(var i = 0; i < p.height; i++) {
      a = p.map(i,0,p.height,xmin,xmax);
      for(var j = 0; j < p.height; j++) {
        b = p.map(j,p.height,0,ymin,ymax);
        x = y = n = 0;
        while (n < maxIter) {
          t = x;  x = p.sq(x)-p.sq(y)+a;  y = 2*t*y+b;
          if (p.sqrt(p.sq(x)+p.sq(y)) > escThr) break;
          n++;
        }
        var index = (i+j*p.width)*4;
        for (var k = 0; k < 3; k++) {
          p.pixels[index+k] = col[k][0]*p.exp(-p.sq(n-col[k][1])/(2*p.sq(col[k][2])));
        }
        p.pixels[index+3] = 255;
      }
    }
    p.updatePixels();
  }

  p.mouseMoved = function() {
    if (p.mouseX > 0 && p.mouseX < p.height && p.mouseY > 0 && p.mouseY < p.height) p.redraw();
  }

  p.mouseClicked = function() {
    var zoomX = p.map(p.mouseX,0,p.height,xmin,xmax);
    var zoomY = p.map(p.mouseY,p.height,0,ymin,ymax);
    var newHW = (p.mouseButton == p.LEFT) ? (xmax-xmin)*0.2 : (xmax-xmin)*0.8;
    var newHH = (p.mouseButton == p.LEFT) ? (ymax-ymin)*0.2 : (ymax-ymin)*0.8;
    xmin = zoomX-newHW;  xmax = zoomX+newHW;
    ymin = zoomY-newHH;  ymax = zoomY+newHH;
    offset = -(xmin+xmax)/2;
    drawMB();  p.redraw();
  }

/*
  p.mouseMoved = function() {
  if (p.mouseX > 0 && p.mouseX < p.height && p.mouseY > 0 && p.mouseY < p.height) {
    var n = 0;
    if (adj) {
      if (n < 3) {
        for (var i = 0; i < p.width*p.height*4; i++) p.pixels[i] = 0;
        n++;
      }
      escThr = p.map(p.mouseX,0,p.height,0,3);
      maxIter = p.map(p.mouseY,p.height,0,1,60);
      drawMB();
    } else p.redraw();
  }

  p.mouseClicked = function() { adj = adj ? false : true; }
*/

}