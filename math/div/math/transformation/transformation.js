var unit, iType, hw, hh;

function setup() {
	createCanvas(800,800);
	unit = 25;
	tType = 0;
  	hw = int(width/2);  hh = int(height/2);
  	M = [1,0, 0,1];
  	N = [1,0, 0,1];
  	noLoop();
}

function draw() {
	translate(hw,hh);
	background(0);
	push();
	applyMatrix(M[0],M[1],0,M[2],M[3],0);
	if (tType != 0) applyMatrix(N[0],N[1],0,N[2],N[3],0);
	stroke(150);  strokeWeight(unit/10);
	for (int i = -hw; i <= hw; i += unit)  line(i,-hh,i,hh);
	for (int i = -hh; i <= hh; i += unit)  line(-hw,i,hw,i);
	stroke(0,200,0);  strokeWeight(unit/5);
	line(0,0,5*unit,-3*unit);
	fill(255,0,0); stroke(255,0,0); strokeWeight(4);
	pop();
}

function keyPressed() {
  for (int i = 0; i < 6; i++) {
    if (key == char(i + '0')) {
      M.apply(N);
      if (tType == i) tType = 0;
      else tType = i;
      redraw();
      break;
    }
  }
}

void mouseMoved() {
  float x = map(mouseX,0,width,-2,2);
  float y = map(mouseY,0,height,-2,2);
  if (x == 0) x += 0.0001;
  if (y == 0) y += 0.0001;
  float t = x*TWO_PI;
  if (tType == 1)      N.set(x,0,0, 0,y,0);
  else if (tType == 2) N.set(cos(t),-sin(t),0, sin(t),cos(t),0);
  else if (tType == 3) N.set(x,y,0, 0,1,0);
  else if (tType == 4) N.set(1,0,0, x,y,0);
  else if (tType == 5) {
    M.reset();
    N.reset();
  }
  redraw();
}

void mouseWheel(MouseEvent event) {
  if (unit - 5*event.getCount() > 0) {
    unit -= 5*event.getCount();
    redraw();
  }
}