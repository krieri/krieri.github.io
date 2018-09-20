var sketch = function(p) {
	var origin, bob, len, angle, aVel, aAcc;

	p.setup = function() {
		p.createCanvas(400, 280);
		len = p.height*9/10;
		angle = p.PI/4;  aVel = 0;  aAcc = 0;
		origin = p.createVector(p.width/2, 0);
		bob = p.createVector(p.width/2, len);
		p.stroke(100);  p.strokeWeight(2);  p.fill(150,150,0);
	}

	p.draw = function() {
		p.background(0);
		bob.x = origin.x + len*p.sin(angle);
		bob.y = origin.y + len*p.cos(angle);
		p.line(origin.x, origin.y, bob.x, bob.y);
		p.ellipse(bob.x, bob.y, len/6, len/6);
		aAcc = -0.01*p.sin(angle);
		angle += aVel;  aVel += aAcc;  aVel *= 0.99;
	}
}