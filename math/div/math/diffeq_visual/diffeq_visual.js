var tmin, tmax, dt, xmin, xmax, field, unit, rows, cols;

function setup() {
	createCanvas(800,600);
	tmin = -3;  tmax = 3;
	xmin = -2;  xmax = 2;
	unit = 20;  dt = 0.1;
	cols = int(width/unit);
	rows = int(height/unit);
	field = new Array(cols);
	for (var i = 0; i < cols; i++) {
		field[i] = new Array(rows);
	}
	update_field();
}

function draw() {
	background(0);
	//update_field();
	var h2 = height/2;
	var arrowLen = unit*4/5;
	stroke(150);  strokeWeight(1);
	var ci, cj;
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			ci = map(i,0,cols,0,width);
			cj = map(j,0,rows,0,height);
			push();
			translate(ci,cj);
			rotate(-field[i][j]);
			line(0,0,arrowLen,0);
			pop();
		}
	}
	translate(0,h2);
	var x, ct, cdt, cx, cnx;
	x = map(mouseY,0,height,xmax,xmin); //x0
	//dt = map(mouseX,0,width,0.01,0.5);
	cdt = dt*width/(tmax-tmin);
	stroke(0,255,0);  strokeWeight(3);

	var nx2, cx2, cnx2, c;
	c = map(mouseX,0,width,-5,5);
	cx2 = map(exp(tmin)/(c+exp(tmin)),xmin,xmax,h2,-h2);
	for (var t = tmin; t < tmax; t += dt) {
		ct = map(t,tmin,tmax,0,width);
		cx = map(x,xmin,xmax,h2,-h2);
		x += d(t,x)*dt;
		cnx = map(x,xmin,xmax,h2,-h2);
		stroke(0,255,0);  line(ct,cx,ct+cdt,cnx);

		nx2 = exp(t+dt)/(c+exp(t+dt));
		cnx2 = map(nx2,xmin,xmax,h2,-h2);
		stroke(255,0,0);
		if (abs(cnx2-cx2) < 100) line(ct,cx2,ct+cdt,cnx2);
		cx2 = map(nx2,xmin,xmax,h2,-h2);
	}
	if (c > 0) ellipse(width/2,0,5,5);
}

function update_field() {
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			var d_ = d(map(i,0,cols,tmin,tmax),
				map(j,0,rows,xmax,xmin));
			field[i][j] = atan(d_,dt);
		}
	}
}

function d(t,x) {
	//return cos(6*t)/(1+t+x**2);
	//return sin(x)*cos(t);
	//return sin(x*t);
	return x-x**2;
}