var angle;

function setup() {
	createCanvas(800, 600);
}

function draw() {
	background(5);
	angle = (mouseX/width)*PI;
	translate(width/2, height);
	branch(190);
}

var branch = function(len) {
	strokeWeight(len/6);
	stroke(map(len,100,25,110,175), map(len,50,0,80,255),0);
	line(0,0,0,-len);
	translate(0,-len);
	len *= 0.67;
	if (len > 2) {
		push();
		rotate(angle);
		branch(len);
		pop();
		push();
		rotate(-angle);
		branch(len);
		pop();
	}
}