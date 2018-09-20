var Particle = function(v) {

	this.pos = createVector(width/2, height/2);
	this.vel = v;
	this.lifespan = 200;
	this.r = 1;

	this.update = function() {
		this.vel.mult(0.995);
		this.pos.add(this.vel);
		this.lifespan -= 1;
		if (this.lifespan >= 150) {
			this.r = map(this.lifespan,200,150,15,30);
		}
	}

	this.isDead = function() {
		if (this.lifespan <= 0) {
			return true;
		} else {
			return false;
		}
	}

	this.display = function() {
		stroke(50, this.lifespan);
		fill(230, 170, 50, this.lifespan);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
	}
}