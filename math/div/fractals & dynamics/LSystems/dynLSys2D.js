var lsys, turtle, t, p, s;

function setup() {
	createCanvas(400,600);
	ruleset = []
	ruleset.push(new Rule('X', "F[+X]F[-X]+X"));
	ruleset.push(new Rule('F', "FF"));
	lsys = new LSystem("X", ruleset);
	turtle = new Turtle(lsys.getSentence());
	p = s = PI/2;
}

function draw() {
	background(255);
	fill(0);
	translate(width/2,height);
	rotate(-PI/2);
	t = map(mouseY,0,height,p-s,p+s);
	turtle.render(t);
	push();
	resetMatrix();
	textSize(20);
	text("Gen " + lsys.getGen(), 20,20);
	text(nf(t/PI,1,8) + " PI", 20,55);
	pop();
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
			for (var j = 0; j < this.ruleset.length; j++) {
				var a = this.ruleset[j].getA();
				if (a == cc) {
					replace = this.ruleset[j].getB();
					break;
				}
			}
			nextgen.push(replace);
		}
		this.sentence = nextgen.toString();
		this.gen++
	}
	this.getSentence = function() {
		return this.sentence;
	}
	this.getGen = function() {
		return this.gen;
	}
}

function Rule(a_, b_) {
	this.a = a_;
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
		stroke(0,175);
		for (var i = 0; i < this.todo.length; i++) {
			var c = this.todo.charAt(i);
			if (c == 'F' || c == 'L' || c == 'R') {
				line(0,0,this.len,0);
				translate(this.len,0);
			}
			else if (c == 'f') {
				translate(this.len,0);
			}
			else if (c == '+') {
				rotate(theta);
			}
			else if (c == '-') {
				rotate(-theta);
			}
			else if (c == '[') {
				push();
			}
			else if (c == ']') {
				pop();
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

/*
function mouseWheel(MouseEvent evt) {
	var m = 1-0.5*evt.getCount();
	turtle.multLen(m);
}

function keyPressed() {
	if (key == 'q') {
		p = t;
	}
	else if (key == 'r') {
		p = PI/2;
	}
	else if (key == '1') {
		s = PI/2;
	}
	else if (key == '2') {
		s = PI/25;
	}
	else if (key == '3') {
		s = PI/100;
	}
	else if (key == '4') {
		s = PI/1000;
	}
	else if (key == '5') {
		s = PI/10000;
	}
	else if (key == '6') {
		s = PI/100000;
	}
}
*/