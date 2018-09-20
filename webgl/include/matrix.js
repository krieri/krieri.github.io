function dot(a,b) {
    var prod = 0;
    for (var i = 0; i < 4; i++) {
        prod += a[i]*b[i];
    }
    return prod;
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

    return [dot(A1,B1), dot(A1,B2), dot(A1,B3), dot(A1,B4),
            dot(A2,B1), dot(A2,B2), dot(A2,B3), dot(A2,B4),
            dot(A3,B1), dot(A3,B2), dot(A3,B3), dot(A3,B4),
            dot(A4,B1), dot(A4,B2), dot(A4,B3), dot(A4,B4)];
}

function translate(m,x,y,z) {
	return matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1], m);
}

function rotate(m,ax,t) {
	switch ax {
		case 'x': return matmul([1,0,0,0, 0,Math.cos(t),-Math.sin(t),0,
						 0,Math.sin(t),Math.cos(t),0, 0,0,0,1], m);
		case 'y': return matmul([Math.cos(t),0,Math.sin(t),0, 0,1,0,0,
						 -Math.sin(t),0,Math.cos(t),0, 0,0,0,1], m);
		case 'z': return matmul([Math.cos(t),-Math.sin(t),0,0,
						 Math.sin(t),Math.cos(t),0,0, 0,0,1,0, 0,0,0,1], m);
		default: return null;
}