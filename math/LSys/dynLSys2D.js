var sketch = function(p) {

	var lsys, turtle, t, pp, s;

	p.setup = function() {
		p.createCanvas(400,600);
		var ruleset = [];
		ruleset.push(new Rule('X', "F[+X]F[-X]+X"));
		ruleset.push(new Rule('F', "FF"));
		lsys = new LSystem("X", ruleset);
		lsys.generate();
		turtle = new Turtle(lsys.getSentence());
		pp = s = p.PI/2;  p.noLoop();
	}

	p.draw = function() {
		p.background(0);
		p.fill(0);
		p.translate(p.width/2,p.height);
		p.rotate(-p.PI/2);
		t = p.map(p.mouseX,0,p.width,pp-s,pp+s);
		turtle.render(t);
		p.push();
		p.resetMatrix();
		p.textSize(20);
		p.text("Gen " + lsys.getGen(), 20,20);
		p.text(p.nf(t/p.PI,1,8) + " PI", 20,55);
		p.pop();
	}


	LSystem = function(axiom, ruleset_) {
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

	Rule = function(a_, b_) {
		this.a = a_;
		this.b = b_;
		this.getA = function() {
			return this.a;
		}
		this.getB = function() {
			return this.b;
		}
	}

	Turtle = function(s) {
		this.todo = s;
		this.len = p.height/5;
		this.render = function(t) {
			var theta = t;
			p.stroke(255);
			for (var i = 0; i < this.todo.length; i++) {
				var c = this.todo.charAt(i);
				if (c == 'F' || c == 'L' || c == 'R') {
					p.line(0,0,this.len,0);
					p.translate(this.len,0);
				}
				else if (c == 'f') {
					p.translate(this.len,0);
				}
				else if (c == '+') {
					p.rotate(theta);
				}
				else if (c == '-') {
					p.rotate(-theta);
				}
				else if (c == '[') {
					p.push();
				}
				else if (c == ']') {
					p.pop();
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

	p.mouseMoved = function() {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height+50) {
			p.redraw();
		}
	}

	update = function() {
		lsys.generate();
		turtle.setTodo(lsys.getSentence());
		turtle.multLen(0.5);
		p.redraw();
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