var lines, t;

function setup() {
	createCanvas(800, 600);
	lines = 30;
	t = 0;
}

function draw() {
	background(20);
	strokeWeight(5);
	translate(width/2, height/2);
	for (var i = 0; i < lines; i++) {
		stroke(20, 220, 255 - map(i, 0, lines, 255, 0));
		line(x1(t + i), y1(t + i), x2(t + i), y2(t + i));
	}
	t += 0.5;
}

var x1 = function(t) {
	return Math.sin(t/8) * mouseX/2 + Math.cos(t/5);
};

var y1 = function(t) {
	return Math.sin(t/14) * mouseY/2 - Math.cos(t/15);
};

var x2 = function(t) {
	return Math.sin(t/10) * mouseX - Math.cos(t/10);
};

var y2 = function(t) {
	return Math.sin(t/12) * mouseY + cos(t/20);
};