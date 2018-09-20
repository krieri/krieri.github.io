function setup() {
	createCanvas(1200,400);
	noLoop();
	background(255);
}

function draw() {
	cantor(0, 100, width);
}

function cantor(x, y, l) {
	noStroke();
	fill(0);
	if (l >= 1) {
		rect(x,y,l,10);
		y += 30;
		cantor(x,y,l/3);
		cantor(x+l*2/3,y,l/3);
	}
}