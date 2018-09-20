var x, y, t, a, b, n, maxIter;

function setup() {
	createCanvas(750,750);
	x = y = n = 0;
	noLoop();
	pixelDensity(1);
	maxIter = 50;
}

function draw() {
	loadPixels();
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			a = map(i,0,width,-2.2,0.7);
			b = map(j,0,height,-1.3,1.3);
			while (n < maxIter) {
				t = x;
				x = x*x-y*y+a;
				y = 2*t*y+b;
				if (dist(0,0,x,y) > 3) break;
				n++;
			}
			var index = (i+j*width)*4-1;
			pixels[index] = map(n,0,maxIter,0,255);
			x = y = n = 0;
		}
	}
	updatePixels();
}