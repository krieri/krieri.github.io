var board, rows, cols, mines, unit, first, left, right, bot;

setup = function() {
	createCanvas(600,600);  noLoop();
	rows = 30;  cols = 16;  mines = 99;
	board = new Array(rows);
	for (var i = 0; i < rows; i++) {
		board[i] = new Array(cols);
		for (var j = 0; j < cols; j++) board[i][j] = 0;
	}
	unit = (width/rows < height/cols) ? width/rows : height/cols;
	first = true;  left = right = false;
	background(255);  stroke(0);  ellipseMode(CENTER);
	textAlign(CENTER);  textSize(unit);
	//bot = new MineBot(true);
}

/*BOARD VALUES
			Blank	Number	Mine 	Uninitialized
Covered		0		1-8		9
Flagged		10 		11-18 	19 		-10
Uncovered	20 		21-28 	29
*/

draw = function() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var num = board[i][j];
			if (num < 20) { //if not uncovered
				fill(200);
				rect(i*unit,j*unit,unit,unit);
				if (num > 9 || num == -10) {
					//mark flagged squares
					fill(210);
					rect(i*unit,j*unit,unit,unit);
					fill(255,0,0);
					text("X",i*unit+unit/2,j*unit+unit/2+8);
				}
			} else if (num < 30) { //if uncovered
				fill(180);
				rect(i*unit,j*unit,unit,unit);
				if (num == 29) { //if mine
					fill(255,0,0);
					rect(i*unit,j*unit,unit,unit);
					fill(0);
					ellipse(i*unit+unit/2,j*unit+unit/2,unit/2,unit/2);
				} else if (num != 20) {
					if (num == 21) fill(0,0,255);
			    	else if (num == 22) fill(0,255,0);
			    	else if (num == 23) fill(255,0,0);
			    	else if (num == 24) fill(0,0,125);
			    	else if (num == 25) fill(0);
			    	else if (num == 26) fill(0);
			    	else if (num == 27) fill(0);
			    	else if (num == 28) fill(0);
			    	text(num-20,i*unit+unit/2,j*unit+unit/2+8);
			    }
		    }
		}
	}
}

mousePressed = function() {
	if (mouseButton == RIGHT) {
		//flagging/unflagging procedure
		right = true;
		var x = floor(mouseX/unit);
		var y = floor(mouseY/unit);
		if (x >= 0 && x < rows && y >= 0 && y < cols) {
			var num = board[x][y];
			if (first == true) {
				board[x][y] = -10;
			} else if (num < 10) {
				board[x][y] += 10;
			} else if (num < 20) {
				board[x][y] -= 10;
			}
			redraw();
		}
	} else if (mouseButton == LEFT) left = true;
}

mouseReleased = function() {
	var x = floor(mouseX/unit);
	var y = floor(mouseY/unit);
	if (x >= 0 && x < rows && y >= 0 && y < cols) {
		var num = board[x][y];

		//first left click
		if (mouseButton == LEFT && first == true && (left && right) == false) {
			var mm = minMax(x,y);
			for (var i = mm[0]; i <= mm[1]; i++) {
				for (var j = mm[2]; j <= mm[3]; j++) {
					//prevent neighbors from becoming mines
					board[x+i][y+j] = 30;
				}
			}
			board[x][y] = 20;
			initialize(x,y);
			/* if (bot.on) {
				bot.init();
				bot.run();
			}

		} else if (bot.on) {
			bot.pos.set(x,y);
			bot.solve(bot.pos);
			*/
		//multi-opening procedure
		} else if ((left && right) == true && num > 20) {
			var fCount = 0;
			var mm = minMax(x,y);
			for (var i = mm[0]; i <= mm[1]; i++) {
				for (var j = mm[2]; j <= mm[3]; j++) {
					if (board[x+i][y+j] > 9 && board[x+i][y+j] < 20) fCount++;
				}
			}
			if (fCount == board[x][y]-20) {
				for (var i = mm[0]; i <= mm[1]; i++) {
					for (var j = mm[2]; j <= mm[3]; j++) {
						if (board[x+i][y+j] == 0) open(x+i,y+j);
						if (board[x+i][y+j] < 10) board[x+i][y+j] += 20;
					}
				}
			}
		//normal opening procedure
		} else if (mouseButton == LEFT && num < 10) {
			if (num == 0) open(x,y);
			else board[x][y] += 20;
		}
		redraw();
	}
	if (mouseButton == LEFT) left = false;
	if (mouseButton == RIGHT) right = false;
}

minMax = function(x,y) {
	//detect borders to avoid index error
	// [0]=imin, [1]=imax, [2]=ymin, [3]=ymax
	var minMax = [-1,1,-1,1];
	if (x == 0) minMax[0] = 0;
	if (x == rows-1) minMax[1] = 0;
	if (y == 0) minMax[2] = 0;
	if (y == cols-1) minMax[3] = 0;
	return minMax;
}

open = function(x,y) {
	var mm = minMax(x,y);
	for (var i = mm[0]; i <= mm[1]; i++) {
		for (var j = mm[2]; j <= mm[3]; j++) {
			if (board[x+i][y+j] < 9) { //if square is covered and not a mine
				//if (bot.on)  bot.notebook[x+i][y+j] = board[x+i][y+j];
				board[x+i][y+j] += 20;
				//repeat if opened square is blank
				if (board[x+i][y+j] == 20) open(x+i,y+j);
			}
		}
	}
}

initialize = function(x,y) {
	first = false;
	var mRatio = 1.0*mines/(rows*cols);
	var m = 0; //mine counter
	while (m < mines) {
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				//ignore clicked square and its neighbors
				if (board[i][j] <= 0) {
					if (random(0,1) < mRatio) {
						//place mine
						if (board[i][j] == -10) board[i][j] = 19;
						else board[i][j] = 9;
						m++;
					}
				}
			}
		}
	}
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (board[i][j] == 30) board[i][j] = 0; //reset protected squares
			else if (board[i][j] == -10) board[i][j] = 10;
			if (board[i][j] != 9 && board[i][j] != 19) {
				//count neighboring mines
				var mCount = 0;
				var mm = minMax(i,j);
				for (var k = mm[0]; k <= mm[1]; k++) {
					for (var l = mm[2]; l <= mm[3]; l++) {
						if (board[i+k][j+l] == 9 || board[i+k][j+l] == 19) mCount++;
					}
				}
				board[i][j] += mCount;
			}
		}
	}
	open(x,y);
}








MineBot = function(on_off) {
	this.on = (on_off) ? true : false;
	this.pos = createVector(-1,0);
	this.notebook = new Array(rows);
	for (var i = 0; i < rows; i++) {
		this.notebook[i] = new Array(cols);
		for (var j = 0; j < cols; j++) {
			this.notebook[i][j] = -1;
		}
	}

	this.init = function() {
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				if (board[i][j] > 19) {
					this.notebook[i][j] = board[i][j]-20;
					if (this.pos.x == -1) {
						this.pos.set(i,j);
					}
				}
			}
		}
	}

	/*
	this.move = function() {
		var mm = minMax(this.pos.x,this.pos.y);
		for (var i = mm[0]; i <= mm[1]; i++) {
			for (var j = mm[2]; j <= mm[3]; j++) {
			}
		}
	}
	*/

	this.run = function() {
		this.solve(this.pos);
		//this.move();
	}

	this.solve = function(p,c,sub=false) {
		var val = this.notebook[x][y];
		if (typeof c !== 'undefined') c = this.getContext(p);
		if (c[0].length > 0) {
			//open safe squares:
			if (val == c[2].length) {
				open(x,y);
			//primary flagging procedure:
			} else if (val == c[0].length+c[2].length) {
				for (var i = 0; i < c[0].length; i++) {
					board[c[0][i].x][c[0][i].y] += 10;
					this.notebook[c[0][i].x][c[0][i].y] = 9;
				}
			//context analysis:
			} else if (!sub) {
				var um = val-c[2].length; //undiscovered mines
				for (var i = 0; i < c[1].length; i++) {
					for (var j = 0; j < c[0].length; j++) {
						//if a blank square is shared by a neighbor:
						if (dist(c[1][i],c[0][j]) < 1.5) {
							//solve for that neighbor only
							//(further recursion not allowed)
							var nc = shiftContext(p, c, c[1][i].x-x, c[1][i].y-y);
							this.solve(c[1][i],nc,sub=true);
						}
					}
				}
			}
		}
	}

	this.getContext = function(p) {
		var context = new Array(3)
		// context[0] = unopened squares
		//context[1] = opened squares
		//context[2] = flags
		for (var i = 0; i < 3; i++) {
			 context[i] = new Array();
		}
		var mm = minMax(x,y);
		for (var i = mm[0]; i <= mm[1]; i++) {
			for (var j = mm[2]; j <= mm[3]; j++) {
				var v = createVector(x+i,y+j);
				if (this.notebook[v.x][v.y] < 0) {
					context[0].push(v);
				} else if (this.notebook[v.x][v.y] < 9) {
					context[1].push(v);
				} else context[2].push(v);
			}
		}
		return context;
	}

	this.shiftContext = function(pRef,cRef,dx,dy) {
		var newCont = cRef.slice(0);
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < newCont[i].length; j++) {
				if (newCont[i][j].x == pRef.x-dx && dx != 0) {
					//newCont[i].pop(
				}
			}
		}
	}
}