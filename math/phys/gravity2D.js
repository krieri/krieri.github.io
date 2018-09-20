var sketch = function(p) {
	var balls, g;

	p.setup = function() {
		p.createCanvas(600, 600);
		g = 0.03;  balls = [];
		for (var i = 0; i < 6; i++) {
			balls[i] = new Ball();
		}
	}

	p.draw = function() {
		p.background(0);
		for (var i = 0; i < balls.length; i++) {
			var force_sum = balls[i].calcForce();
			balls[i].applyForce(force_sum);
			balls[i].update();
			balls[i].bounce();
			balls[i].display();
		}
	}

	Ball = function() {
		this.pos = p.createVector(p.random(p.width), p.random(p.height));
		this.vel = p.createVector(0, 0);
		this.acc = p.createVector(0, 0);
		this.mass = p.random(5, 20);
	}

	Ball.prototype.pull = function(b) {
		var force = p5.Vector.sub(this.pos, b.pos);
		var distance = force.mag();
		var strength = (g*this.mass*b.mass) / (distance*distance);
		force.mult(strength);
		return force;
	}

	Ball.prototype.calcForce = function() {
		var force_sum = p.createVector(0, 0);
		for (var i = 0; i < balls.length; i++) {
			if (balls[i] !== this) {
				force_sum.add(balls[i].pull(this));
			}
		}
		return force_sum;
	}

	Ball.prototype.applyForce = function(force) {
		var f = p5.Vector.div(force, this.mass);
		this.acc.add(f);
	}

	Ball.prototype.bounce = function() {
		if (this.pos.x > p.width) {
			this.pos.x = p.width;
			this.vel.x *= -1;
		}
		if (this.pos.x < 0) {
			this.pos.x = 0;
			this.vel.x *= -1;
		}
		if (this.pos.y > p.height) {
			this.pos.y = p.height;
			this.vel.y *= -1;
		}
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.vel.y *= -1;
		}
	}

	Ball.prototype.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	Ball.prototype.display = function() {
		p.stroke(200);  p.strokeWeight(1.5);
		p.fill(0,50,200,150);
		p.ellipse(this.pos.x, this.pos.y, this.mass*3, this.mass*3);
	}
}