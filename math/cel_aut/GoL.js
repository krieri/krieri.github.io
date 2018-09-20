var sketch = function(p) {
	var game, t, unit, mode, skip, discrete, pause;

	p.setup = function() {
		p.createCanvas(600,600);
		t = 0;  skip = 5;  unit = 4;  mode = 2;
		discrete = true;  pause = false;
		p.textSize(22);  p.noStroke();
		game = new GoL();  game.init();
	}

	p.draw = function() {
		var a = p.map(p.mouseX,0,p.width,0,8.9);
		var b = p.map(p.mouseY,p.height,0,0,8.9);
		if (discrete) { a = p.round(a);  b = p.round(b); }
		if (mode == 0) { game.blt = a;  game.but = b; }
		else if (mode == 1) { game.slt = a;  game.sut = b; }
		if (t >= skip &! pause) {
			p.background(0);  game.run();  game.display();  t = 0;
		}
		t++;
	}

	restart_game = function() { game.init(); }

	GoL = function() {
		this.blt = 3;  this.but = 3;  this.slt = 3;  this.sut = 4;
		// birth/survival lower/upper threshold

		this.init = function() {
			this.cols = p.round(p.width/unit);
			this.rows = p.round(p.height/unit);
			this.board = new Array(this.cols).fill(0);
			for (var i = 0; i < this.cols; i++) {
				this.board[i] = new Array(this.rows).fill(0);
			}
			this.empty = this.board.slice();
			for (var i = 1; i < this.cols; i++) {
				for (var j = 1; j < this.rows-1; j++) {
					this.board[i][j] = (discrete) ? p.round(p.random()) : p.random();
				}
			}
		}

		this.run = function() {
			if (!discrete) var delta = 0.25;
			var nxt = this.empty.slice();
			for (var i = 1; i < this.cols-1; i++) {
				for (var j = 1; j < this.rows-1; j++) {
					var c = this.board[i][j];
					var sum = -c;  //compensate for counting itself
					for (var k = -1; k < 2; k++) {
						for (var l = -1; l < 2; l++) {
							sum += this.board[i+k][j+l];
						}
					}
					if (discrete) {
						if (c == 1 && (sum < this.slt || sum > this.sut)) nxt[i][j] = 0;
						else if (c == 0 && sum >= this.blt && sum <= this.but) nxt[i][j] = 1;
						else nxt[i][j] = c;
					} else {
						if (sum < this.slt || sum > this.sut) nxt[i][j] = c-delta;
						else nxt[i][j] = c+10*delta;
					}
				}
			}
			this.board = nxt;
		}

		this.display = function() {
			if (discrete) p.fill(0,200,0);
			for (var i = 1; i < this.cols-1; i++) {
				for (var j = 1; j < this.rows-1; j++) {
					if (discrete && this.board[i][j] == 1) p.rect(i*unit,j*unit,unit,unit);
					else if (!discrete) { p.fill(0,p.map(this.board[i][j],0,1,0,255),0);  p.rect(i*unit,j*unit,unit,unit) }
				}
			}
		}

		this.kill = function() {
			for (var i = 0; i < this.cols; i++) {
				for (var j = 0; j < this.rows; j++) {
					this.board[i][j] = 0;
				}
			}
		}
	}
}