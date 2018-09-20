var sketch = function(p) {
	var unit, step, hw, hh;

	p.setup = function() {
		p.createCanvas(700,700);  p.noLoop();
		hw = p.round(p.width/2);  hh = p.round(p.height/2); 
		unit = (p.height < p.width) ? hh : hw;
		step = p.TWO_PI/400;
	}

	p.draw = function() {
		p.translate(hw,hh);  p.background(0);
		p.stroke(75);  p.strokeWeight(2);
		p.line(0,-hw,0,hw,0);  p.line(-hh,0,hh,0);
		p.stroke(0,200,0);  p.strokeWeight(5);
		var a, r, rp;  a = 0;  rp = f(-step)*unit;
		while (a <= p.TWO_PI) {
			r = f(a)*unit;
			p.line(r*p.cos(a),r*p.sin(a),rp*p.cos(a-step),rp*p.sin(a-step));
			rp = r;  a += step;
		}
	}

	f = function(a) {
		this.x = p.map(p.mouseX,0,p.width,0,p.PI);
		this.y = p.map(p.mouseY,p.height,0,0,p.PI);
		return (p.sin(a*x*10)+2)/4;
	}

	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			p.redraw();
		}
	}
}