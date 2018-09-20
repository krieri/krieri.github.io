var game, disc, t, skip;

function setup() {
	createCanvas(600,600);
	game = new GoL(4);
	disc = true;
	game.init();
	skip = 4;  t = 0;
}

function draw() {
	if (t >= skip) {
		background(0);
		game.run();
		game.disp();
		t = 0;
	} t++;
}

function keyPressed() {
	if (key == 'r') game.init();
}



function GoL(unit_) {
	this.unit = unit_;

	this.init = function() {
		this.cols = width/unit;
		this.rows = height/unit;
		this.board = new Array(this.rows);
		for (var i = 0; i < this.rows; i++) {
			this.board[i] = new Array(this.cols);
			for (var j = 0; j < this.cols; j++) {
				if (disc = false) this.board[i][j] = random(0,1);
				else this.board[i][j] = int(random(2));
			}
		}
	}
}