var sketch = function(p) {
	var population;
	var lifespan = 100;
	var lifeP;
	var count = 0;
	var target;

	p.setup = function() {
		p.createCanvas(400,300);
		population = new Population();
		lifeP = p.createP();
		target = p.createVector(p.width/2, 50);
	}

	p.draw = function() {
		p.background(0);
		population.run();
		lifeP.html(count);
		if (count == lifespan) {
			population.evaluate();
			population.selection();
			count = -1;
		}
		count++;
		p.ellipse(target.x, target.y, 16, 16);
	}

	function Population() {
		this.rockets = [];
		this.popSize = 25;
		this.matingPool = [];
		for (var i = 0; i < this.popSize; i++) {
			this.rockets[i] = new Rocket();
		}
		this.evaluate = function() {
			var maxFit = 0;
			for (var i = 0; i < this.popSize; i++) {
				this.rockets[i].calcFitness();
				if (this.rockets[i].fitness > maxFit) {
					maxFit = this.rockets[i].fitness;
				}
			}
			for (var i = 0; i < this.popSize; i++) {
				this.rockets[i].fitness /= maxFit;
			}
			this.matingPool = []
			for (var i = 0; i < this.popSize; i++) {
				var n = this.rockets[i].fitness*100;
				for(var j = 0; j < n; j++) {
					this.matingPool.push(this.rockets[i]);
				}
			}
		}
		this.selection = function() {
			var newRockets = [];
			for (var i = 0; i < this.rockets.length; i++) {
				var parentA = p.random(this.matingPool).dna;
				var parentB = p.random(this.matingPool).dna;
				var child = parentA.crossover(parentB);
				newRockets[i] = new Rocket(child);
			}
			this.rockets = newRockets;
		}
		this.run = function() {
			for (var i = 0; i < this.popSize; i++) {
				this.rockets[i].update();
				this.rockets[i].display();
			}
		}
	}

	function DNA(genes) {
		if (genes) {
			this.genes = genes;
		} else {
			this.genes = [];
			for (var i = 0; i < lifespan; i++) {
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(0.2);
			}
		}
		this.crossover = function(partner) {
			var newGenes = [];
			var mid = p.floor(p.random(this.genes.length));
			for (var i = 0; i < this.genes.length; i++) {
				if (i > mid) {
					newGenes[i] = this.genes[i];
				} else {
					newGenes[i] = partner.genes[i];
				}
			}
			return new DNA(newGenes);
		}
	}

	function Rocket(dna) {
		this.pos = p.createVector(p.width/2, p.height);
		this.vel = p.createVector();
		this.acc = p.createVector();
		if (dna) {
			this.dna = dna;
		} else {
			this.dna = new DNA();
		}
		this.applyForce = function(force) {
			this.acc.add(force);
		}
		this.calcFitness = function() {
			var d = p.dist(this.pos.x,this.pos.y,target.x,target.y);
			this.fitness = p.map(d, 0, p.width, p.width, 0);
		}
		this.update = function() {
			this.applyForce(this.dna.genes[count]);
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}
		this.display = function() {
			p.push();
			p.noStroke();
			p.fill(255, 150);
			p.translate(this.pos.x, this.pos.y);
			p.rotate(this.vel.heading());
			p.rectMode(p.CENTER);
			p.rect(0, 0, 25, 5);
			p.pop();
		}
	}
}