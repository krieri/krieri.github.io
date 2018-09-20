var sketch = function(p) {
	var hw, hh, ang;

	p.setup = function() {
		p.createCanvas(600,600);
		hw = p.width/2;  hh = p.height/2;
		p.stroke(255);  p.noFill();
		p.noLoop();  drawCircle(hw,hh,hh);
	}

	drawCircle = function(x,y,d) {
		p.ellipse(x,y,d);
		while (d > 10) {
			d /= 2;
			p.push();  p.translate(d,0);  p.rotate(ang);
			drawCircle(x+d,y,d);  drawCircle(x-d,y,d);  p.pop();
		}
	}

	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			ang = p.map(p.mouseX,0,p.width,0,p.PI);
			p.translate(hw,hh);  p.rotate(ang);
			p.background(0);  drawCircle(0,0,hh);
			p.resetMatrix();
		}
	}
}