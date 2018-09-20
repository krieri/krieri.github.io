var sketch = function(p) {
	var pts, coef, unit, res, hw, hh;

	p.setup = function() {
		p.createCanvas(800,600);  p.noLoop();
		hw = p.width/2;  hh = p.height/2;
		pts = [];  coef = [];  unit = 20;  res = 5;
	}

	p.draw = function() {
		p.translate(hw,hh);  p.background(0);
		p.stroke(75);  p.strokeWeight(2);
		p.line(-hw,0,hw,0);  p.line(0,-hh,0,hh);
		for (var i = 1; i < 1.0*hw/unit; i++) {
			p.line(i*unit,-5,i*unit,5);
			p.line(-i*unit,-5,-i*unit,5);
		}
		for (var i = 1; i < 1.0*hh/unit; i++) {
			p.line(-5,i*unit,5,i*unit);
			p.line(-5,-i*unit,5,-i*unit);
		}
		if (coef.length == 0) return;
		p.stroke(0,200,0);  p.strokeWeight(4);
		var y, py;  py = NwtPoly(-hw)-hh;
		for (var x = 0; x < p.width; x += res) {
			y = NwtPoly(x)-hh;
			p.line(x-hw-res,py,x-hw,y);
			py = y;
		}
		p.stroke(255);  p.noFill();
		for (var i = 0; i < pts.length; i++) {
			p.ellipse(pts[i].x-hw,pts[i].y-hh,8,8);
		}
	}

	divDif = function(pp) {
		var len = pp.length;
		var dd = new Array(len);
		for (var i = 0; i < len; i++) {
			dd[i] = new Array(len-i);
			dd[0][i] = pp[i].y;
		}
		for (var i = 1; i < len; i++) {
			for (var j = 0; j < len-i; j++) {
				dd[i][j] = (dd[i-1][j+1]-dd[i-1][j])/(pp[j+i].x-pp[j].x);
			}
		}
		return dd;
	}

	interpol = function(pp) {
		var dd = divDif(pp);
		var c = new Array(dd.length);
		for (var i = 0; i < dd.length; i++) {
			c[i] = dd[i][0];
		}
		return c;
	}

	NwtPoly = function(x) {
		var y = 0;  var fac = 1;
		for (var i = 0; i < coef.length; i++) {
			y += coef[i]*fac;
			fac *= (x-pts[i].x);
		}
		return y;
	}

	p.mousePressed = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			var move = false;
			for (var i = 0; i < pts.length; i++) {
				if (p.abs(pts[i].x-p.mouseX) < 10 && p.abs(pts[i].y-p.mouseY) < 10) {
					move = true;
					var moved = pts[i];
					pts.splice(i,1);
					if (p.mouseButton == p.LEFT) {
						pts.push(moved);
					}
					break;
				}
			}
			if (!move && p.mouseButton == p.LEFT) {
				pts.push(p.createVector(p.mouseX,p.mouseY));
			}
			coef = interpol(pts);
			p.redraw();
		}
	}

	p.mouseDragged = function() {
		if (p.mouseButton == p.LEFT) {
			pts[pts.length-1].set(p.mouseX,p.mouseY);
			coef = interpol(pts);
			p.redraw();
		}
	}
}

	/*
	function mouseWheel(MouseEvent evt) {
		if (unit - 5*evt.getCount() > 0) {
			unit -= 5*evt.getCount();
		}
	}
	*/