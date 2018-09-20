var sketch = function(p) {
	var angle;

	p.setup = function() {
		p.createCanvas(380,300);  p.noLoop();  angle = p.PI*1/4;
	}

	p.draw = function() {
		p.background(0);  p.translate(p.width/2, p.height);  branch(p.width/4);
	}

	branch = function(len) {
		p.strokeWeight(len/6);  p.stroke(p.map(len,100,25,100,150), p.map(len,80,0,0,255),0);
		p.line(0,0,0,-len);  p.translate(0,-len);  len *= 0.67;
		if (len > 2) {
			p.push();  p.rotate(angle);  branch(len);  p.pop();
			p.push();  p.rotate(-angle); branch(len);  p.pop();
		}
	}
	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			angle = (p.mouseX/p.width)*p.PI;  p.redraw();
		}
	}
}