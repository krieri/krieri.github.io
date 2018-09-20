var x, y, t, a, b, n, maxIter;

function setup() {
	var disp = document.getElementById('display');
	var canvas = createCanvas(550,500);
	disp.width = String(canvas.width)+'px';
	disp.height = String(canvas.height)+'px';
	canvas.parent(disp);
	loadPixels();
	pixelDensity(1);
	x = y = n = 0;
}

function draw() {
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
			var col = map(n,0,maxIter,255,0);
			var index = (i+j*width)*4;
			n = 0;
			while (n < 3) {
				pixels[index+n] = col;
				n++;
			}
			pixels[index+3] = 255;
			x = y = n = 0;
		}
	}
	updatePixels();
}