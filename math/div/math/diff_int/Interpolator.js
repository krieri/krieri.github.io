function Interpolator() {

	this.pts = [];	//interpolation points (2D PVector format)
	this.coef = []; //Newton polynomial coefficients (c0, c1, etc.)
	this.d = 0; //derivative

	this.interpolate = function() {
		var len = this.pts.length;		//dd:	   c4	 etc.
		var dd = new Array(len);		//		 c3	  *
		for (var i = 0; i < len; i++) {	//	   c2	*	*
			dd[i] = new Array(len-i);	//	 c1	  *   *	  *
			dd[0][i] = this.pts[i].y;	// c0	y1	y2	y3	y4
		}
		for (var i = 1; i < len; i++) {
			for (var j = 0; j < len-i; j++) {
				//calculate divided difference at each address:
				dd[i][j] = (dd[i-1][j+1] - dd[i-1][j]) / (this.pts[j+i].x - this.pts[j].x);
			}
		}
		this.coef.length = 0;
		for (var i = 0; i < dd.length; i++) {
			//grab coefficients from first row:
			this.coef.push(dd[i][0]);
		}
	}

	this.evaluate = function(x) {
		var y = 0;  var fac = 1;
		for (var i = 0; i < this.coef.length; i++) {
			y += this.coef[i]*fac;
			fac *= (x-this.pts[i].x);
			//p(x) = c0 + (x-x0)(c1 + (x-x1)(c2 + (x-x2)(...))))))
			//fac = 1 	*=(x-x0)	*=(x-x1)	*=(x-x2)	etc.
			//y = fac*c0	   *=c1		   *=c2		  *=c3	   etc.
		}
		return y;
	}

	this.differentiate = function(x) {
		var i, p, dp;
		i = this.coef.length-1;
		p = dp = this.coef[i];
		for (i -= 1; i >= 0; i--) {
			var tx = x - this.pts[i].x; //(x-x_i)
			dp = dp*tx + p; //p_k'(x) = p_k+1'(x)*(x-x_k) + p_k+1(x)
			p = p*tx + this.coef[i]; //p_k(x) = p_k+1(x)*(x-k_k) + c_k
		}
		this.d = dp;
	}
}