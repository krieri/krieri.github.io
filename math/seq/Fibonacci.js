var sketch = function(p) {
	var particles, angle, fibonacci, info;

	p.setup = function() {
		p.createCanvas(600, 600);
		particles = [];
		angle = p.createVector(1.9, 0);
		fibonacci = true;
	}

	p.draw = function() {
		p.background(0);
		particles.push(new Particle(angle.copy()));
		for (var i = particles.length-1; i >= 0; i--) {
			var part = particles[i];
			part.update();
			part.display();
			if (part.isDead()) {
				particles.splice(i, 1);
			}
		}
		var r;
		if (fibonacci) {
			r = 2.3998;
			info = "137.5" + String.fromCharCode(176);
		} else {
			r = p.map(p.mouseX, 0, p.width, 0, p.TWO_PI);
			info = p.nf(r*180/p.PI, 3, 1) + String.fromCharCode(176);
		}
		angle.rotate(r);
		p.textSize(32);
		p.fill(255);
		p.text(info, 10, 40);
	}

	p.mouseClicked = function() {
		if (fibonacci) {
			fibonacci = false;
		} else {
			fibonacci = true;
			info = "137.5" + String.fromCharCode(176);
		}
	}

	Particle = function(v) {
		this.pos = p.createVector(p.width/2, p.height/2);
		this.vel = v;
		this.lifespan = 200;
		this.r = 1;

		this.update = function() {
			this.vel.mult(0.995);
			this.pos.add(this.vel);
			this.lifespan -= 1;
			if (this.lifespan >= 150) {
				this.r = p.map(this.lifespan,200,150,15,30);
			}
		}

		this.isDead = function() {
			if (this.lifespan <= 0) return true;
			else return false;
		}

		this.display = function() {
			p.stroke(50, this.lifespan);
			p.fill(230, 170, 50, this.lifespan);
			p.ellipse(this.pos.x, this.pos.y, this.r, this.r);
		}
	}
}