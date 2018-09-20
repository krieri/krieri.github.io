var sketch = function(p) {

	var particles

	p.setup = function() {
		p.createCanvas(800,600,p.WEBGL);

	}

	p.draw = function() {
		p.background(0);
		for (var n in particles) {
			n.pos += v(n.pos)
		}
	}

	particle = function(p_) {
		this.pos = p.createVector(p_.x,p_.y,p_.z);
		this.age = 0;
	}

	v = function(pos) {
		return createVector()
	}

}