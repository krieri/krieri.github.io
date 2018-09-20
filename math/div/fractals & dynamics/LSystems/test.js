var ang, bam, wat;

function setup() {
	createCanvas(600,600,WEBGL);
	wat = 75;
}

function draw() {
	background(0);
	translate(0,0);
	sphere(50);
	gah = map(mouseX,0,width,0,PI/2);
	bam = map(mouseY,0,height,0,1/3);
	finishItLord(75,gah);
}

function finishItLord(boom,baah) {
	while (boom < 25*wat) {
		rotateX(baah);
		rotateY(bam*baah);
		rotateZ(2*bam*baah);
		torus(boom);
		boom += 25;
	}
}