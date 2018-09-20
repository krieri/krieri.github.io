var sketch = function(p) {
	var x, y, z, a, b, c, dt, n, pts, hw, hh;

	p.setup = function() {
	  p.createCanvas(800,600,p.WEBGL);
	  x = 0.01;  y = 0;  z = 0;
	  a = 10.0;  b = 28.0;  c = 8.0/3;
	  dt = 0.01;  pts = [];  n = 0;
	  p.stroke(0,255,100);  p.strokeWeight(0.2);
	  p.noFill();  //p.frameRate(300);
	}

	p.draw = function() {
	  var dx = a*(y-x)*dt;
	  var dy = (x*(b-z)-y)*dt;
	  var dz = (x*y-c*z)*dt;
	  x += dx;  y += dy;  z += dz;
	  pts.push(p.createVector(x,y,z));
	  p.background(0);
	  p.translate(400, 300, 20);
	  p.scale(5);  p.rotateY(n);
	  p.beginShape(p.LINES);
	  //for (var v in pts) {
	    //p.vertex(pts[v].x, pts[v].y, pts[v].z);
	  //}
	  //p.vertex(100,200,20);  p.vertex(200,50,10);
	  p.endShape();
	  n += 0.001;
	}
}