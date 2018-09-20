var sketch = function(p) {
	var lsys, turtle, leaf, theta, pp, s, xr, radius, test;
	
	p.setup = function() {
		p.createCanvas(600,800,p.WEBGL);  p.noLoop();
		$.getScript('LSys/test.js', function() {
			test = new testClass();
		});
	}

	p.draw = function() {
		console.log(test.number, test.func(2));
	}

	/*
	p.draw = function() {
		p.background(0);
		radius = 8;
		theta = p.map(p.mouseY,0,p.height,pp-s,pp+s);

		p.push();
		p.translate(p.width/2,p.height*9/10);
		p.rotateX(xr);
		p.rotateY(p.map(p.mouseX,0,p.width,0,p.TWO_PI));
		p.rotateZ(-p.PI/2);
		turtle.render(theta);
		p.pop();

		p.textSize(20);  p.fill(255);
		p.text("Gen " + lsys.getGen(),20,30);
		p.text(p.nf(theta/p.PI,1,10) + " PI",20,50);
	}

	p.mousePressed = function() {
		if (p.mouseButton == p.LEFT) {
			lsys.generate();
			turtle.setToDo(lsys.getSentence());
			turtle.multLen(0.5);
		}
	}

	p.mouseWheel = function(event) { turtle.multLen(1-event/6); }


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
	*/
}