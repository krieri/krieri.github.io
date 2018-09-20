var unit;

function setup() {
	createCanvas(800,600);
	strokeWeight(4);
	unit = 2;
}

function draw() {
	background(255);
	translate(width/2,height/2);
	var y1, y2, yp1, yp2;
	for (var x = 0; x < width; x += unit) {
		y1 = -exp(x);
		y2 = -taylor(x,mouseX/(unit*20));
		if (x > 0) {
			stroke(0,0,255);
			line(x,y1,x-unit,yp1);
			stroke(255,0,0);
			line(x,y2,x-unit,yp2);
		}
		yp1 = y1;  yp2 = y2;
	}
}

function taylor(x, max) {
	var s = 0;  var fac = 1;
	for (var k = 1; k <= max; k++) {
		fac *= k;
		s += pow(x,k)/fac;
	}
	return s;
}