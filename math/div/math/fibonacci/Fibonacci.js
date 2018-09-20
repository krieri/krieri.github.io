var particles, angle, fibonacci, info;

function setup() {
	createCanvas(600, 600);
	particles = [];
	angle = createVector(1.9, 0);
	fibonacci = true;
}

function draw() {
	background(0);
	particles.push(new Particle(angle.copy()));
	for (var i = particles.length-1; i >= 0; i--) {
		var p = particles[i];
		p.update();
		p.display();
		if (p.isDead()) {
			particles.splice(i, 1);
		}
	}
	var r;
	if (fibonacci) {
		r = 2.3998;
		info = "137.5" + String.fromCharCode(176);
	} else {
		r = map(mouseX, 0, width, 0, TWO_PI);
		info = nf(r*180/PI, 3, 1) + String.fromCharCode(176);
	}
	angle.rotate(r);
	textSize(32);
	fill(255);
	text(info, 10, 40);
}

function mouseClicked() {
	if (fibonacci) {
		fibonacci = false;
	} else {
		fibonacci = true;
		info = "137.5" + String.fromCharCode(176);
	}
}