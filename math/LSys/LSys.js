//module.exports = {
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