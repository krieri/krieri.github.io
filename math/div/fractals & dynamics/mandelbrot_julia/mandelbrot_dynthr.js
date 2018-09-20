var x, y, t, a, b, n, maxIter;

function setup() {
	createCanvas(550, 500);
	pixelDensity(1);
	x = y = n = 0;
}

function draw() {
	loadPixels();
	maxIter = map(mouseY,0,height,25,0);
	var thres = map(mouseX,0,width,0,2.5);
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			a = map(i,0,width,-2.2,0.7);
			b = map(j,0,height,-1.3,1.3);
			while (n < maxIter) {
				t = x;
				x = sq(x)-sq(y)+a;
				y = 2*t*y+b;
				if (sqrt(sq(x)+sqrt(y))>thres) break;
				n++;
			}
			var index = (i+j*width)*4-1;
			pixels[index] = map(n,0,maxIter,255,0);
			x = y = n = 0;
		}
	}
	updatePixels();
}