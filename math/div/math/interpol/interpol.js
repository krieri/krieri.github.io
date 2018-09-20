var pts, coef, unit, res;

function setup() {
	createCanvas(800,600);
	pts = [];
	coef = [];
	unit = 20;
	res = 5;
	noLoop();
}

function draw() {
	translate(width/2,height/2);
	background(0);
	stroke(75);  strokeWeight(2);
	line(-width/2,0,width/2,0);
	line(0,-height/2,0,height/2);
	for (var i = 1; i < (width/2.0)/unit; i++) {
		line(i*unit,-5,i*unit,5);
		line(-i*unit,-5,-i*unit,5);
	}
	for (var i = 1; i < (height/2.0)/unit; i++) {
		line(-5,i*unit,5,i*unit);
		line(-5,-i*unit,5,-i*unit);
	}
	stroke(0,200,0);  strokeWeight(4);
	var y, py;  py = NwtPoly(-width/(2))-height/2;
	for (var x = 0; x < width; x += res) {
		y = NwtPoly(x)-height/2;
		line(x-width/2-res,py,x-width/2,y);
		py = y;
	}
	stroke(255);  noFill();
	for (var i = 0; i < pts.length; i++) {
		ellipse(pts[i].x-width/2,pts[i].y-height/2,8,8);
	}
}

function divDif(p) {
	var len = p.length;
	var dd = new Array(len);
	for (var i = 0; i < len; i++) {
		dd[i] = new Array(len-i);
		dd[0][i] = p[i].y;
	}
	for (var i = 1; i < len; i++) {
		for (var j = 0; j < len-i; j++) {
			dd[i][j] = (dd[i-1][j+1]-dd[i-1][j])/(p[j+i].x-p[j].x);
		}
	}
	return dd;
}

function interpol(p) {
	var dd = divDif(p);
	var c = new Array(dd.length);
	for (var i = 0; i < dd.length; i++) {
		c[i] = dd[i][0];
	}
	return c;
}

function NwtPoly(x) {
	var y = 0;  var fac = 1;
	for (var i = 0; i < coef.length; i++) {
		y += coef[i]*fac;
		fac *= (x-pts[i].x);
	}
	return y;
}

function mousePressed() {
	var move = false;
	for (var i = 0; i < pts.length; i++) {
		if (abs(pts[i].x-mouseX) < 10 && abs(pts[i].y-mouseY) < 10) {
			move = true;
			var moved = pts[i];
			pts.splice(i,1);
			if (mouseButton == LEFT) {
				pts.push(moved);
			}
			break;
		}
	}
	if (!move && mouseButton == LEFT) {
		pts.push(createVector(mouseX,mouseY));
	}
	coef = interpol(pts);
	redraw();
}

function mouseDragged() {
	if (mouseButton == LEFT) {
		pts[pts.length-1].set(mouseX,mouseY);
		coef = interpol(pts);
		redraw();
	}
}

/*
function mouseWheel(MouseEvent evt) {
	if (unit - 5*evt.getCount() > 0) {
		unit -= 5*evt.getCount();
	}
}
*/