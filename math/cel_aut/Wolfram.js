var sketch = function(p) {
	var automaton;

	p.setup = function() {
		p.createCanvas(600,200);
		automaton = new CA([0,1,1,1,1,0,0,0], 4);  automaton.init();
		p.stroke(0);  p.fill(255);  p.frameRate(20);
	}

	p.draw = function() {
		p.background(0);
		automaton.display();
		automaton.generate();
		if(automaton.gen == automaton.cols/2+automaton.rows) p.noLoop();
	}

	restart = function() { automaton.init(); automaton.gen = 0; p.loop(); }

	CA = function(r,u) {
		this.ruleset = r;
		this.unit = u;
		this.cols = p.round(p.width/this.unit);
		this.rows = p.round(p.height/this.unit);
		this.matrix = [];
		for (var i = 0; i < this.cols; i++) this.matrix[i] = [];
		this.gen = 0;

		this.init = function() {
			for (var i = 0; i < this.cols; i++) {
				for (var j = 0; j < this.rows; j++) {
					this.matrix[i][j] = 0;
				}
			}
			this.matrix[p.round(this.cols/2)][0] = 1;
		}

		this.randomize = function() {
			for (var i = 0; i < 8; i++) {
				this.ruleset[i] = p.round(p.random(2));
			}
		}
		this.setRules = function(r) { this.ruleset = r; }

		this.generate = function() {
			for (var i = 0; i < this.cols; i++) {
				var left = this.matrix[(i+this.cols-1)%this.cols][this.gen%this.rows];
				var me = this.matrix[i][this.gen%this.rows];
				var right = this.matrix[(i+this.cols+1)%this.cols][this.gen%this.rows];
				this.matrix[i][(this.gen+1)%this.rows] = this.rules(left,me,right);
			}
			this.gen++;
		}
		this.rules = function(a,b,c) {
			var s = "" + a + b + c;
			var index = parseInt(s, 2);
			return this.ruleset[index];
		}
		this.display = function() {
			var offset = this.gen%this.rows;
			for (var i = 0; i < this.cols; i++) {
				for (var j = 0; j < this.rows; j++) {
					var y = j - offset;
					if (y <= 0) y += this.rows;
					if (this.matrix[i][j] == 1) {
						p.rect(i*this.unit, (y-1)*this.unit, this.unit, this.unit);
					}
				}
			}
		}
		this.finished = function() {
			if (this.gen > height/w) return true;
			else return false;
		}
	}
}