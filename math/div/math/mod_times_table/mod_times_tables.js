var r, maxm, n, u, disc;

function setup() {
	createCanvas(640,640);
	r = width*9/20;
	stroke(255);
	strokeWeight(1);
	fill(255); textSize(20);
	maxm = 10;
	n = 10;
	disc = true;
	u = false;
	frameRate(20);
}

function draw() {
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height || u) {
		var m, step, x, y, a, d;
		background(0);
		m = map(mouseX,0,width,1,maxm);
		if (disc) m = int(m);
		step = TWO_PI/n;  x = r;  y = a = 0;
		text("p: " + n +"\nm: " + m, 20, 20);
		translate(width/2,height/2);
		for (var i = 0; i <= n; i++) {
			x = r*cos(a);  y = r*sin(a);
			d = (i*m % n)*step;
			line(x,y,r*cos(d),r*sin(d));
			a += step;
		}
	}
	u = false;
}

function update() {
	maxm = document.getElementById("m_slider").value;
	n = document.getElementById("n_slider").value;
	strokeWeight(map(n,1,750,1,0.12));
	u = true;
}

function dc() {
	if (disc) disc = false;
	else disc = true;
}

function mouseWheel(event) {
	var dr = -event.delta*20;
	if (dr > 0 && r < 10000 || dr < 0 && r > abs(dr)) {
		r += dr;
	}
}