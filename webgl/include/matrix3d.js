function mapV1(x,f,t,nf,nt) {
	return (x-f)*(nt-nf)/(t-f) + nf;
}

function addV3(a,b) {
	return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}

function subV3(a,b) {
	return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

function magV3(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function normV3(v) {
	var len = magV3(v);
	return [v[0]/len, v[1]/len, v[2]/len];
}

function dotV3(a,b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function dotV4(a,b) {
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
}

function cross(a,b) {
	return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}

function matmul(A,B) {
    var A1 = [A[0],A[1],A[2],A[3]];
    var A2 = [A[4],A[5],A[6],A[7]];
    var A3 = [A[8],A[9],A[10],A[11]];
    var A4 = [A[12],A[13],A[14],A[15]];
    var B1 = [B[0],B[4],B[8],B[12]];
    var B2 = [B[1],B[5],B[9],B[13]];
    var B3 = [B[2],B[6],B[10],B[14]];
    var B4 = [B[3],B[7],B[11],B[15]];

    return [dotV4(A1,B1), dotV4(A1,B2), dotV4(A1,B3), dotV4(A1,B4),
            dotV4(A2,B1), dotV4(A2,B2), dotV4(A2,B3), dotV4(A2,B4),
            dotV4(A3,B1), dotV4(A3,B2), dotV4(A3,B3), dotV4(A3,B4),
            dotV4(A4,B1), dotV4(A4,B2), dotV4(A4,B3), dotV4(A4,B4)];
}

function matvecmul4(A,v) {
    return [dotV4([A[0],A[1],A[2],A[3]],v), dotV4([A[4],A[5],A[6],A[7]],v),
    		dotV4([A[8],A[9],A[10],A[11]],v), dotV4([A[12],A[13],A[14],A[15]],v)];
}

function inverse(m) {
	var n = Math.sqrt(m.length);
	if (n % 1 != 0) {
		console.error("Attempted to invert a non-square matrix!");
		return null;
	}
	var M = [];  // M = m = nxn matrix
	for (var i = 0; i < n*n; i++) M[i] = m[i];
	var inv = (n == 4) ? identityMatrix4() : null; // ...
	var pivotRows = [];

	for (var ci = 0; ci < n; ci++) { // iterate over columns
		var val = 0; // largest value (corresponding element will be pivotized)
		var ri = null; // pivot element's row index
		// find the row with the largest value at column ci
		// don't check rows that already have a pivot element
		for (var i = 0; i < n; i++) { // iterate over rows
			var thisVal = M[4*i+ci];
			if (!(pivotRows.includes(i)) && Math.abs(thisVal) > val) {
				val = thisVal;
				ri = i;
			}
		}
		pivotRows[ci] = ri;
		if (val != 1) { // invertibility assumed (val != 0)
			// pivotize
			for (var i = 0; i < n; i++) {
				M[4*ri+i] /= val; // divide row ri by val
				inv[4*ri+i] /= val;
			}
		}
		// perform row reduction (total)
		for (var i = 0; i < n; i++) { // iterate over rows
			if (i != ri) { // ignore the pivot row
				var elim = M[4*i+ci]; // value to be eliminated
				if (elim != 0) {
					for (var j = 0; j < n; j++) {
						M[4*i+j] -= elim*M[4*ri+j];
						inv[4*i+j] -= elim*inv[4*ri+j];
					}
				}
			}
		}
		// obtain the reduced row echelon form by rearranging rows
		var inverse = [];
		for (var i = 0; i < n; i++) { // rows
			for (var j = 0; j < n; j++) { // columns
				inverse[4*i+j] = inv[4*pivotRows[i]+j];
			}
		}
	}
	return inverse;
}

function translate(m,tv) {
	return matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, tv[0],tv[1],tv[2],1], m);
}

function scale(m,s) {
	return [m[0]*s, m[1]*s, m[2]*s, m[3]*s, m[4]*s, m[5]*s, m[6]*s, m[7]*s,
			m[8]*s, m[9]*s, m[10]*s, m[11]*s, m[12], m[13], m[14], m[15]];
}

function rotate(m,ax,t) {
	switch(ax) {
		case 'x': return matmul([1,0,0,0, 0,Math.cos(t),-Math.sin(t),0,
						 0,Math.sin(t),Math.cos(t),0, 0,0,0,1], m);
		case 'y': return matmul([Math.cos(t),0,Math.sin(t),0, 0,1,0,0,
						 -Math.sin(t),0,Math.cos(t),0, 0,0,0,1], m);
		case 'z': return matmul([Math.cos(t),-Math.sin(t),0,0,
						 Math.sin(t),Math.cos(t),0,0, 0,0,1,0, 0,0,0,1], m);
		default: return null;
	}
}

function identityMatrix4() {
	return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
}

function MatrixStack(im) {
	this.stack = [];
	this.stack[0] = (im === undefined) ? identityMatrix4() : im;

	this.pushMatrix = function() {
		this.stack.push(this.getMatrix());
	}

	this.popMatrix = function() {
		this.stack.pop();
	}

	this.getMatrix = function() {
		return this.stack[this.stack.length-1].slice();
	}

	this.setMatrix = function(m) {
		this.stack[this.stack.length-1] = m;
	}

	this.translate = function(tv) {
		var cm = this.getMatrix();
		this.setMatrix(translate(cm,tv));
	}

	this.scale = function(s) {
		var cm = this.getMatrix();
		this.setMatrix(scale(cm,s));
	}

	this.rotate = function(ax, t) {
		var cm = this.getMatrix();
		this.setMatrix(rotate(cm,ax,t));
	}

	this.matmul = function(other) {
		this.setMatrix(matmul(other,this.getMatrix()));
	}
}