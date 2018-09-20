var f, x, unit, xmin, xmax, ymin, ymax;

function setup() {
	createCanvas(800,600);
	unit = 1;
	xmin = -20;  xmax = 20;
	ymin = -20;  ymax = 20;
	noLoop();
	update();
}

function draw() {
	background(255);
	translate(width/2,height/2);
	var y, px, py;
	for (var i = -width/2; i <= width/2; i += unit) {
		x = map(i,-width/2,width/2,xmin,xmax);
		y = map(eval(f),ymin,ymax,height/2,-height/2);
		if (i != width/2) {
			line(px,py,i,y);
		}
		px = i;  py = y;
	}
}

function update() {
	var v = document.getElementById("input").value;
	if (v.length > 0) {
		f = v;
		redraw();
	}
}