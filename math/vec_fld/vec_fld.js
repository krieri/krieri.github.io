var sketch = function(p) {
	var hw, hh, lim, unit, particles, lifespan, field, t, dt, mode, auto;

	p.setup = function() {
		p.createCanvas(600,600);
		hw = p.width/2;  hh = p.height/2;  field = new Field('x','y',timeDep=true);
		dt = 0.001;  auto = true;  mode = true; //true: velocity,  false: acceleration
		particles = [];  lifespan = 100;  unit = p.width/30;
		p.fill(0,0,255);  update();
	}

	p.draw = function() {
		p.background(0);  p.translate(hw,hh);
		field.quiver();
		if (p.mouseIsPressed) {
			if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
				if (p.mouseButton == p.RIGHT) {
					particles.push(new Particle(p.createVector((p.mouseX-hw)*lim/hw, (p.mouseY-hh)*lim/hh), 8));
				} else if (p.mouseButton == p.LEFT) {
					for (var i = 0; i < 10; i++) {
						particles.push(new Particle(p.createVector(p.random(-lim,lim), p.random(-lim,lim)), 8));
					}
				}
			}
		//} else if (auto) {
			//for (var i = 0; i < )
		}
		for (var n in particles) {
			if (mode) {
				particles[n].vel = field.getVel(particles[n].pos.x,particles[n].pos.y);
				particles[n].vel.mult(0.1);
			} else {
				particles[n].acc.add(field.getVel(particles[n].pos.x,particles[n].pos.y));
				particles[n].acc.mult(0.01);
			}
			particles[n].update();
			particles[n].display();
			if (particles[n].age >= lifespan) particles.splice(n,1);
		}
		t += dt;
	}

	update = function() {
		try {
			var x = 1;  var y = 1;
			var test = eval(document.getElementById('vx_input').value);
			test = eval(document.getElementById('vy_input').value);
		} catch(err) { return; }
		field.vx = document.getElementById('vx_input').value;
		field.vy = document.getElementById('vy_input').value;
		lim = document.getElementById('limit').value;
		t = 0;
	}

	changeMode = function() { mode = (mode) ? false : true; }

	Particle = function(p_,m_) {
		this.pos = p.createVector(p_.x,p_.y);
		this.vel = p.createVector(0,0);
		this.acc = p.createVector(0,0);
		this.mass = m_;  this.age = 0;

		this.update = function() {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.age++;
		}
		this.display = function() {
			p.fill(0,255,0,255-this.age*255/lifespan);  p.noStroke();
			p.ellipse(this.pos.x*hw/lim, this.pos.y*hh/lim, this.mass, this.mass);
		}
	}

	Attractor = function(p_,m_) {
		this.pos = p.createVector(p_.x,p_.y);
		this.mass = m_;
	}

	Field = function(vx_,vy_,timeDep=false) {
		this.vx = vx_;  this.vy = vy_;
		if (!timeDep) {
			this.buffer = [];
			for (var i = 0; i < p.width; i += unit) {
				for (var j = 0; j < p.height; j += unit) {
					var arrow = this.getVel(i+unit/2,j+unit/2);
					this.buffer.push(arrow);
				}
			}
		} else this.buffer = null;

		this.getVel = function(x,y_) {
			var y = -y_;
			return p.createVector(eval(this.vx), -eval(this.vy));
		}
		this.quiver = function() {
			var u1, u2, u3;
			u1 = unit*0.44;  u2 = unit*0.30;  u3 = unit*0.12;
			p.stroke(60);
			if (!this.buffer) {
				for (var i = -hw; i < hw; i += unit) {
					for (var j = -hh; j < hh; j += unit) {
						var arrow = this.getVel((i+u1)*lim/hw,(j+u1)*lim/hh);
						p.push();
						p.translate(i+u1,j+u1);
						p.rotate(-p.atan2(arrow.x,arrow.y));
						p.line(0,-u1,0,u1);
						p.line(0,u1,-u3,u2);
						p.line(0,u1,u3,u2);
						p.pop();
					}
				}
			} else {
				for (var arr in this.buffer) {
					p.line(arr.x,arr.y);
				}
			}
		}
	}
}