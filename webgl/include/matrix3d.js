function mapV1(x,n,f,nn,nf) {
	return (x-n)*(nf-nn)/(f-n) + nn;
}

function addV3(a,b) {
	return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}

function subV3(a,b) {
	return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

function scaleV3(v,s) {
	return [v[0]*s, v[1]*s, v[2]*s];
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
	var A1 = [A[0],A[4],A[8],A[12]];
	var A2 = [A[1],A[5],A[9],A[13]];
	var A3 = [A[2],A[6],A[10],A[14]];
	var A4 = [A[3],A[7],A[11],A[15]];
	var B1 = [B[0],B[1],B[2],B[3]];
	var B2 = [B[4],B[5],B[6],B[7]];
	var B3 = [B[8],B[9],B[10],B[11]];
	var B4 = [B[12],B[13],B[14],B[15]];

	return [dotV4(A1,B1), dotV4(A2,B1), dotV4(A3,B1), dotV4(A4,B1),
			dotV4(A1,B2), dotV4(A2,B2), dotV4(A3,B2), dotV4(A4,B2),
			dotV4(A1,B3), dotV4(A2,B3), dotV4(A3,B3), dotV4(A4,B3),
			dotV4(A1,B4), dotV4(A2,B4), dotV4(A3,B4), dotV4(A4,B4)];
}

function matvecmul4(A,v) {
    return [dotV4([A[0],A[4],A[8],A[12]],v), dotV4([A[1],A[5],A[9],A[13]],v),
    		dotV4([A[2],A[6],A[10],A[14]],v), dotV4([A[3],A[7],A[11],A[15]],v)];
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
			var thisVal = M[i+4*ci];
			if (!(pivotRows.includes(i)) && Math.abs(thisVal) > Math.abs(val)) {
				val = thisVal;
				ri = i;
			}
		}
		if (val == 0) console.error("Matrix is not invertible!");
		pivotRows[ci] = ri;
		if (val != 1) {
			// pivotize
			for (var i = 0; i < n; i++) {
				M[ri+4*i] /= val; // divide row ri by val
				inv[ri+4*i] /= val;
			}
		}
		// perform row reduction (total)
		for (var i = 0; i < n; i++) { // iterate over rows
			if (i != ri) { // ignore the pivot row
				var elim = M[i+4*ci]; // value to be eliminated
				if (elim != 0) {
					for (var j = 0; j < n; j++) {
						M[i+4*j] -= elim*M[ri+4*j];
						inv[i+4*j] -= elim*inv[ri+4*j];
					}
				}
			}
		}
	}
	// obtain the reduced row echelon form by rearranging rows
	var inverse = [];
	for (var i = 0; i < n; i++) { // rows
		for (var j = 0; j < n; j++) { // columns
			inverse[i+4*j] = inv[pivotRows[i]+4*j];
		}
	}
	return inverse;
}

function translate(m,tv) {
	return matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, tv[0],tv[1],tv[2],1], m);
}

function scale(m,s) {
	return [m[0]*s, m[1]*s, m[2]*s, m[3], m[4]*s, m[5]*s, m[6]*s, m[7],
			m[8]*s, m[9]*s, m[10]*s, m[11], m[12]*s, m[13]*s, m[14]*s, m[15]];
}

function rotate(m,ax,t) {
	var st = Math.sin(t);
	var ct = Math.cos(t);
	switch(ax) {
		case 'x': return matmul([1,0,0,0, 0,ct,st,0, 0,-st,ct,0, 0,0,0,1], m);
		case 'y': return matmul([ct,0,-st,0, 0,1,0,0, st,0,ct,0, 0,0,0,1], m);
		case 'z': return matmul([ct,st,0,0, -st,ct,0,0, 0,0,1,0, 0,0,0,1], m);
		default: return null;
	}
}

function identityMatrix4() {
	return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
}

function MatrixStack(initial) {
	this.stack = [];
	this.stack[0] = (initial === undefined) ? identityMatrix4() : initial;

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
		this.setMatrix(translate(this.getMatrix(),tv));
	}

	this.scale = function(s) {
		this.setMatrix(scale(this.getMatrix(),s));
	}

	this.rotate = function(ax, t) {
		this.setMatrix(rotate(this.getMatrix(),ax,t));
	}

	this.matmul = function(other) {
		this.setMatrix(matmul(other,this.getMatrix()));
	}
}