var sketch = function(p) {
	var f, xunit, yunit, xmin, xmax, ymin, ymax,
		cxmin, cxmax, cymin, cymax, center, 
		Interpol, d_type, nPts, spread,
		inter, deriv, integr, cpts,
		newton, dList;


	p.setup = function() {
		p.createCanvas(800,600);
		xunit = yunit = 50; //pixels
		xmin = -20;  xmax = 20;
		ymin = -20;  ymax = 20;
		center = p.createVector(p.round(p.width/2),p.round(p.height/2));
		//upper and lower drawing thresholds:
		cxmax = p.round(p.width/2);   cxmin = -cxmax;
		cymin = p.round(p.height/2);  cymax = -cymin;
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
		p.fill(255,255,0);  
		Interpol = new Interpolator();
		p.noLoop();  update();
	}


	p.draw = function() {
		p.background(0);
		p.translate(center.x,center.y);
		//ordinary and converted x-/y-values
		//+ memory for previous step:
		var x, y, cx, cy, pcx, pcy;

		//draw gridlines
		p.stroke(50);   p.strokeWeight(1);
		for (cx = cxmin-cxmin%xunit; cx <= cxmax; cx += xunit) {
			p.line(cx, cymin, cx, cymax);
		}
		for (cy = cymax-cymax%yunit; cy <= cymin; cy += yunit) {
			p.line(cxmin, cy, cxmax, cy);
		}
		p.stroke(70);   p.strokeWeight(2.5);
		p.line(0, cymin, 0, cymax);   p.line(cxmin, 0, cxmax, 0);


		//graph f(x)
		p.strokeWeight(4);
		for (cx = cxmin; cx <= cxmax; cx += 2) {
			p.stroke(200);
			x = p.map(cx, cxmin, cxmax, xmin, xmax);
			y = eval(f);
			cy = p.round(p.map(y, ymin, ymax, cymin, cymax));
			if (integr && cx < p.mouseX-center.x) {
				p.stroke(50);
				p.line(cx,cy,cx,0);
				p.stroke(70);
			}
			if (cx != cxmin) p.line(pcx, pcy, cx, cy);
			pcx = cx;  pcy = cy;
		}
		if (inter) {
			//graph p(x)
			//(draw separately to prevent partial overlap)
			for (cx = cxmin; cx <= cxmax; cx += 2) {
				p.stroke(255,0,0);
				x = p.map(cx, cxmin, cxmax, xmin, xmax);
				y = Interpol.evaluate(x);
				cy = p.round(p.map(y, ymin, ymax, cymin, cymax));
				if (cx != cxmin) p.line(pcx, pcy, cx, cy);
				pcx = cx;  pcy = cy;
			}
		}
		if (deriv) {
			//draw tangent
			x = p.map(p.mouseX-center.x, cxmin, cxmax, xmin, xmax);
			y = eval(f);	//find f(x)
			cy = p.round(p.map(y, ymin, ymax, cymin, cymax));
			/*  var act = sin(x/2)+cos(x/2)*x/2; //for comparison
			p.stroke(255);  p.push();
			p.translate(p.mouseX-center.x,cy);
			p.rotate(-p.atan(act));  p.line(0,0,p.width*2,0);
			p.line(0,0,-p.width*2,0);  p.pop(); */
			p.stroke(0,0,255);
			p.push();
			p.translate(p.mouseX-center.x,cy);
			p.rotate(-p.atan(Interpol.d));
			p.line(0,0,p.width*2,0);  p.line(0,0,-p.width*2,0);
			p.pop();
		}
		if (newton) {
			p.stroke(255);  p.strokeWeight(1.5);
			for (var i = 0; i < dList.length; i++) {
				p.ellipse(dList[i][0],dList[i][1],20,20);
				p.push();
				p.translate(dList[i][0],dList[i][1]);
				p.rotate(-p.atan(dList[i][2]));
				p.line(0,0,p.width*2,0);  p.line(0,0,-p.width*2,0);
				p.pop();
			}
		}
		//plot interpolation points
		if (inter) {
			p.noStroke();
			for (var i = 0; i < cpts.length; i++) {
				p.ellipse(cpts[i].x, cpts[i].y, 10, 10);
			}
			cpts.length = 0;
		}
	}


	run = function(cx_, add=true) {
		//approximate f'(x)
		Interpol.pts.length = 0;  cpts.length = 0;
		var lim = (nPts-1)*spread/2.0;
		for (var i = -lim; i < lim+0.01; i += spread) {
			var cx = cx_-center.x + i;
			x = p.map(cx,cxmin,cxmax,xmin,xmax);
			var y = eval(f);
			var cy = p.round(p.map(y,ymin,ymax,cymin,cymax));
			cpts.push(p.createVector(cx,cy));
			Interpol.pts.push(p.createVector(x,y));
		}
		Interpol.interpolate();
		if (deriv || newton) {
			cx = cx_-center.x;
			x = p.map(cx,cxmin,cxmax,xmin,xmax);
			Interpol.differentiate(x);
		}
		if (newton && add) dList.push([cx,p.map(eval(f),ymin,ymax,cymin,cymax),Interpol.d]);
	}


	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			if (inside) {
				if (newton) {
					var root_cx, x, y, cy, pol;
					root_cx = p.mouseX-center.x;
					x = p.map(root_cx,cxmin,cxmax,xmin,xmax);
					y = eval(f);
					dList.length = 0;
					for (var i = 0; i < 8; i++) {
						if (p.abs(y) < 1) break;
						else {
							run(root_cx);
							if (Interpol.d >= 0) pol = -1;
							else pol = 1;
							root_cx += pol*p.round(p.map((y/Interpol.d),xmin,xmax,cxmin,cxmax)+center.x);
							x = p.map(root_cx,cxmin,cxmax,xmin,xmax);
							y = eval(f);
						}
					}
				}
				if (deriv) run(p.mouseX, add=false);
			}
			p.redraw();
		}
	}

	inside = function() { return true; }

	/*
	p.mouseWheel = function(event) {
		var inc = event < 0 ? 1.2 : 0.8;
		if (inc > 1 && xunit < p.width/2 && yunit < p.height/2
		|| (inc < 1 && xunit > 2 && yunit > 2)) {
			xunit = p.round(xunit*inc);  yunit = p.round(yunit*inc);
			p.redraw();
		}
	}
	*/

	update = function() {
		var new_f = document.getElementById("input").value;
		var new_nPts = p.round(document.getElementById("nPts").value);
		var new_spread = p.round(document.getElementById("spread").value);
		if (new_f.length > 0) f = new_f;
		if (new_nPts > 1 && new_nPts < 20) nPts = new_nPts;
		if (new_spread >= 1 && new_spread < 2*xunit) spread = new_spread;
		p.redraw();
	}

	Interpolator = function() {

		this.pts = [];	//interpolation points (2D PVector format)
		this.coef = []; //Newton polynomial coefficients (c0, c1, etc.)
		this.d = 0; //derivative

		this.interpolate = function() {
			var len = this.pts.length;		//dd:	   c4	 etc.
			var dd = new Array(len);		//		 c3	  *
			for (var i = 0; i < len; i++) {	//	   c2	*	*
				dd[i] = new Array(len-i);	//	 c1	  *   *	  *
				dd[0][i] = this.pts[i].y;	// c0	y1	y2	y3	y4
			}
			for (var i = 1; i < len; i++) {
				for (var j = 0; j < len-i; j++) {
					//calculate divided difference at each address:
					dd[i][j] = (dd[i-1][j+1] - dd[i-1][j]) / (this.pts[j+i].x - this.pts[j].x);
				}
			}
			this.coef.length = 0;
			for (var i = 0; i < dd.length; i++) {
				//grab coefficients from first row:
				this.coef.push(dd[i][0]);
			}
		}

		this.evaluate = function(x) {
			var y = 0;  var fac = 1;
			for (var i = 0; i < this.coef.length; i++) {
				y += this.coef[i]*fac;
				fac *= (x-this.pts[i].x);
				//p(x) = c0 + (x-x0)(c1 + (x-x1)(c2 + (x-x2)(...))))))
				//fac = 1 	*=(x-x0)	*=(x-x1)	*=(x-x2)	etc.
				//y = fac*c0	   *=c1		   *=c2		  *=c3	   etc.
			}
			return y;
		}

		this.differentiate = function(x) {
			var i, p, dp;
			i = this.coef.length-1;
			p = dp = this.coef[i];
			for (i -= 1; i >= 0; i--) {
				var tx = x - this.pts[i].x; //(x-x_i)
				dp = dp*tx + p; //p_k'(x) = p_k+1'(x)*(x-x_k) + p_k+1(x)
				p = p*tx + this.coef[i]; //p_k(x) = p_k+1(x)*(x-k_k) + c_k
			}
			this.d = dp;
		}
	}
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