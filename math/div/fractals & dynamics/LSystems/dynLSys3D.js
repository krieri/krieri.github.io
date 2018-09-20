var lsys, turtle, leaf, theta, p, s, xr, radius, axiom;

function setup() {
	createCanvas(400,600,WEBGL);
	axiom = "X";
	ruleset = []
	ruleset.push(new Rule('X',0.25,"F/[<YL]F\\[>YL]F/[vYL]F\\[^YL]X"));
	ruleset.push(new Rule('X',0.25,"F\\[>YL]F/[<YL]F\\[^YL]F/[vYL]X"));
	ruleset.push(new Rule('X',0.25,"F/[vYL]F\\[^YL]F/[>YL]F\\[<YL]X"));
	ruleset.push(new Rule('X',0.25,"F\\[^YL]F/[vYL]F\\[<YL]F/[>YL]X"));
	ruleset.push(new Rule('Y',0.25,"B/[<YL]B\\[>YL]B/[vYL]B\\[^YL]Y"));
	ruleset.push(new Rule('Y',0.25,"B\\[>YL]B/[<YL]B\\[^YL]B/[vYL]Y"));
	ruleset.push(new Rule('Y',0.25,"B/[vYL]B\\[^YL]B/[>YL]B\\[<YL]Y"));
	ruleset.push(new Rule('Y',0.25,"B\\[^YL]B/[vYL]B\\[<YL]B/[>YL]Y"));
	ruleset.push(new Rule('F',"FF"));
	ruleset.push(new Rule('B',"BB"));
	lsys = new LSystem(axiom, ruleset);
	turtle = new Turtle(axiom);

	/*
	leaf
	*/

	p = s = PI/2;
	xr = 0;
}

function draw() {
	//background(255);
	fill(0);
	radius = 8;
	theta = map(mouseY,0,width,p-s,p+s);

	push();
	translate(width/2,height*9/10);
	rotateX(xr);
	rotateY(map(mouseX,0,width,0,TWO_PI));
	rotateZ(-PI/2);
	turtle.render(theta);
	pop();

	/*
	textSize(20);
	fill(0);
	text("Gen " + lsys.getGen(), 20,30);
	text(nf(theta/PI,1,10) + " PI", 20,50);
	*/
}

function LSystem(axiom, ruleset_) {
	this.sentence = axiom;
	this.ruleset = ruleset_;
	this.gen = 0;
	this.generate = function() {
		var nextgen = []
		for (var i = 0; i < this.sentence.length; i++) {
			var cc = this.sentence.charAt(i);
			var replace = "" + cc
			var candidates = [];
			for (var j = 0; j < this.ruleset.length; j++) {
				var a = this.ruleset[j].getA();
				if (a != cc) {
					continue;
				} else {
					candidates.push(this.ruleset[j]);
				}
			}
			if (candidates.length > 0) {
				var done = false;
				while (done != true) {
					for (var k = 0; k < candidates.length; k++) {
						if (random(0,1) < candidates[k].prob) {
							replace = candidates[k].getB();
							done = true;
						}
					}
				}
			}
			nextgen.push(replace);
		}
		this.sentence = nextgen.toString();
		this.gen++;
	}
	this.getSentence = function() {
		return this.sentence;
	}
	this.getGen = function() {
		return this.gen;
	}
}

function Rule(a_, p, b_) {
	this.a = a_;
	this.prob = p;
	this.b = b_;
	this.getA = function() {
		return this.a;
	}
	this.getB = function() {
		return this.b;
	}
}

function Turtle(s) {
	this.todo = s;
	this.len = height/3;
	this.render = function(t) {
		var theta = t;
		stroke(80,80,50);
		for (var i = 0; i < this.todo.length; i++) {
			var c = this.todo.charAt(i);
			if (c == 'F') {
				fill(radius-5+2*lsys.gen);
				cylinder(1,this.len,3,1);
				translate(this.len,0,0);
			}
			else if (c == 'f') {
				translate(this.len,0,0);
			}
			else if (c == 'L') {
				fill(0,200,0,100);
				sphere(10);
			}
			else if (c == '\\') {
				rotateX(theta);
			}
			else if (c == '/') {
				rotateX(-theta);
			}
			else if (c == 'v') {
				rotateY(theta);
			}
			else if (c == '^') {
				rotateY(-theta);
			}
			else if (c == '<') {
				rotateZ(theta);
			}
			else if (c == '>') {
				rotateZ(-theta);
			}
			else if (c == '|') {
				rotateZ(PI);
			}
			else if (c == '[') {
				push();
				radius -= 4;
			}
			else if (c == ']') {
				pop();
				radius += 4;
			}
			else if (c == 'B') {
				rotateY((theta*pow(4.2,lsys.gen))/(lsys.gen*lsys.sentence.length));
				strokeWeigth(radius-5+2*lsys.gen);
				cylinder(1,this.len,3,1);
				translate(this.len,0,0);
			}
		}
	}
	this.setTodo = function(s) {
		this.todo = s;
	}
	this.multLen = function(m) {
		this.len *= m;
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		lsys.generate();
		turtle.setTodo(lsys.getSentence());
		turtle.multLen(0.5);
	}
}