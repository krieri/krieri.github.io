var f, xunit, yunit, xmin, xmax, ymin, ymax,
	cxmin, cxmax, cymin, cymax, center, 
	Interpol, d_type, nPts, spread,
	inter, deriv, integr, cpts,
	newton, dList;


function setup() {
	createCanvas(800,600);
	xunit = yunit = 50; //pixels
	xmin = -20;  xmax = 20;
	ymin = -20;  ymax = 20;
	center = createVector(int(width/2),int(height/2));
	//upper and lower drawing thresholds:
	cxmax = int(width/2);   cxmin = -cxmax;
	cymin = int(height/2);  cymax = -cymin;
	d_type = 0; //0: forward, 1: middle, 2:backward
	spread = 10; //distance between interpolation points
	//on/off for interpolation and differentiation:
	deriv = true;  inter = true;  integr = false;
	newton = false;
	a = 0;
	nPts = 5; //number of interpolation points
	cpts = []; //pts converted to c-values
	cList = []; //list of coefficients for integration
	dList = [];
	fill(255,255,0);  
	Interpol = new Interpolator();
	noLoop();	update();
}


function draw() {
	background(0);
	translate(center.x,center.y);
	//ordinary and converted x-/y-values
	//+ memory for previous step:
	var x, y, cx, cy, pcx, pcy;

	//draw gridlines
	stroke(50);   strokeWeight(1);
	for (cx = cxmin-cxmin%xunit; cx <= cxmax; cx += xunit) {
		line(cx, cymin, cx, cymax);
	}
	for (cy = cymax-cymax%yunit; cy <= cymin; cy += yunit) {
		line(cxmin, cy, cxmax, cy);
	}
	stroke(70);   strokeWeight(2.5);
	line(0, cymin, 0, cymax);   line(cxmin, 0, cxmax, 0);


	//graph f(x)
	strokeWeight(4);
	for (cx = cxmin; cx <= cxmax; cx += 2) {
		stroke(200);
		x = map(cx, cxmin, cxmax, xmin, xmax);
		y = eval(f);
		cy = int(map(y, ymin, ymax, cymin, cymax));
		if (integr && cx < mouseX-center.x) {
			stroke(50);
			line(cx,cy,cx,0);
			stroke(70);
		}
		if (cx != cxmin) line(pcx, pcy, cx, cy);
		pcx = cx;  pcy = cy;
	}
	if (inter) {
		//graph p(x)
		//(draw separately to prevent partial overlap)
		for (cx = cxmin; cx <= cxmax; cx += 2) {
			stroke(255,0,0);
			x = map(cx, cxmin, cxmax, xmin, xmax);
			y = Interpol.evaluate(x);
			cy = int(map(y, ymin, ymax, cymin, cymax));
			if (cx != cxmin) line(pcx, pcy, cx, cy);
			pcx = cx;  pcy = cy;
		}
	}
	if (deriv) {
		//draw tangent
		x = map(mouseX-center.x, cxmin, cxmax, xmin, xmax);
		y = eval(f);	//find f(x)
		cy = int(map(y, ymin, ymax, cymin, cymax));
		/*  var act = sin(x/2)+cos(x/2)*x/2; //for comparison
		stroke(255);  push();
		translate(mouseX-center.x,cy);
		rotate(-atan(act));  line(0,0,width*2,0);
		line(0,0,-width*2,0);  pop(); */
		stroke(0,0,255);
		push();
		translate(mouseX-center.x,cy);
		rotate(-atan(Interpol.d));
		line(0,0,width*2,0);  line(0,0,-width*2,0);
		pop();
	}
	if (newton) {
		stroke(255);  strokeWeight(1.5);
		for (var i = 0; i < dList.length; i++) {
			ellipse(dList[i][0],dList[i][1],20,20);
			push();
			translate(dList[i][0],dList[i][1]);
			rotate(-atan(dList[i][2]));
			line(0,0,width*2,0);  line(0,0,-width*2,0);
			pop();
		}
	}
	//plot interpolation points
	if (inter) {
		noStroke();
		for (var i = 0; i < cpts.length; i++) {
			ellipse(cpts[i].x, cpts[i].y, 10, 10);
		}
		cpts.length = 0;
	}
}


function run(cx_, add=true) {
	//approximate f'(x)
	Interpol.pts.length = 0;  cpts.length = 0;
	var lim = (nPts-1)*spread/2.0;
	for (var i = -lim; i < lim+0.01; i += spread) {
		var cx = cx_-center.x + i;
		x = map(cx,cxmin,cxmax,xmin,xmax);
		var y = eval(f);
		var cy = int(map(y,ymin,ymax,cymin,cymax));
		cpts.push(createVector(cx,cy));
		Interpol.pts.push(createVector(x,y));
	}
	Interpol.interpolate();
	if (deriv || newton) {
		cx = cx_-center.x;
		x = map(cx,cxmin,cxmax,xmin,xmax);
		Interpol.differentiate(x);
	}
	if (newton && add) dList.push([cx,map(eval(f),ymin,ymax,cymin,cymax),Interpol.d]);
}


function mouseMoved() {
	if (inside) {
		if (newton) {
			var root_cx, x, y, cy, pol;
			root_cx = mouseX-center.x;
			x = map(root_cx,cxmin,cxmax,xmin,xmax);
			y = eval(f);
			dList.length = 0;
			for (var i = 0; i < 8; i++) {
				if (abs(y) < 1) break;
				else {
					run(root_cx);
					if (Interpol.d >= 0) pol = -1;
					else pol = 1;
					root_cx += pol*int(map((y/Interpol.d),xmin,xmax,cxmin,cxmax)+center.x);
					x = map(root_cx,cxmin,cxmax,xmin,xmax);
					y = eval(f);
				}
			}
		}
		if (deriv) run(mouseX, add=false);
	}
	redraw();
}


function inside() {
	return true;
}


function mouseWheel(event) {
	var inc = event.delta < 0 ? 1.2 : 0.8;
	if (inc > 1 && xunit < width/2 && yunit < height/2
	|| (inc < 1 && xunit > 2 && yunit > 2)) {
		xunit = int(xunit*inc);  yunit = int(yunit*inc);
		redraw();
	}
}


function update() {
	var new_f = document.getElementById("input").value;
	var new_nPts = int(document.getElementById("nPts").value);
	var new_spread = int(document.getElementById("spread").value);
	if (new_f.length > 0) f = new_f;
	if (new_nPts > 1 && new_nPts < 20) nPts = new_nPts;
	if (new_spread >= 1 && new_spread < 2*xunit) spread = new_spread;
	redraw();
}


/*
if (mouseIsPressed) {
	center.set(mouseX, mouseY);
	cxmin = -center.x;  cxmax = width-center.x;
	cymax = -center.y;  cymin = height-center.y;
	redraw();
}
*/


/*
function Simpson(nSPts_) {
	this.initialize = function() {
		this.sSpread = int(width/(nSPts-1));
		this.
	}
	this.sSpread
	ppp;
	sSpread = int((mouxeX-center.x)/(nSPts-1));  cx = cxmin;
	for (var s = cxmin+2*sSpread; s <= mouseX-center.x+0.1; s += 2*sSpread) {
		if (s != cxmin) ppp = Interpol.pts[2];
		else ppp = createVector(xmin,eval(f));
		Interpol.pts.length = 0;
		Interpol.pts.push(ppp);
		while (Interpol.pts.length < 3) {
			cx += sSpread;  x = map(cx, cxmin, cxmax, xmin, xmax);
			Interpol.pts.push(createVector(x,eval(f)));
		}
		Interpol.interpolate();

		for (cx = Interpol.pts[0].x; cx < Interpol.pts[2].x; cx++) {

		}
	}
}
*/