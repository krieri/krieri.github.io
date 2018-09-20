var sketch = function(p) {
	var r, maxm, n, u, disc;

	p.setup = function() {
		p.createCanvas(640,640);
		r = p.width*9/20;
		p.stroke(255);  p.strokeWeight(1);
		p.fill(255);  p.textSize(20);
		maxm = 4;  n = 2;
		disc = false;  u = false;
		p.frameRate(20);  p.noLoop();
	}

	p.draw = function() {
		var m, step, x, y, a, d;
		p.background(0);
		m = p.map(p.mouseX,0,p.width,1,maxm);
		if (disc) m = p.round(m);
		step = p.TWO_PI/n;  x = r;  y = a = 0;
		p.text("p: " + n +"\nm: " + m, 20, 20);
		p.translate(p.width/2,p.height/2);
		for (var i = 0; i <= n; i++) {
			x = r*p.cos(a);  y = r*p.sin(a);
			d = (i*m % n)*step;
			p.line(x,-y,r*p.cos(d),-r*p.sin(d));
			a += step;
		}
		u = false;
	}

	update = function() {
		maxm = document.getElementById("m_slider").value;
		n = document.getElementById("n_slider").value;
		p.strokeWeight(p.map(n,1,750,1,0.12));
		u = true;  p.redraw();
	}

	dc = function() { disc = (disc) ? false : true; }

	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height || u) p.redraw();
	}

	p.mouseWheel = function(event) {
		var dr = -event*20;
		if (dr > 0 && r < 10000 || dr < 0 && r > p.abs(dr)) r += dr;
	}
}