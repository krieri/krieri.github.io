var gl, program, vb;

function setup() {
	var canv = createCanvas("canvas", window.innerWidth, window.innerHeight);
	gl = GLinit(canv);
	var vs = getShader(gl, "vertexShader");
	var fs = getShader(gl, "fragmentShader");
    program = setupProgram(gl, [vs, fs]);

    program.a_vertexPosition = gl.getAttribLocation(program, "a_vertexPosition");
    program.u_resolution = gl.getUniformLocation(program, "u_resolution");
    program.u_transform = gl.getUniformLocation(program, "u_transform");
    program.u_translate = gl.getUniformLocation(program, "u_translate");
    
    var hw = gl.canvas.width/2;
    var hh = gl.canvas.height/2;
    vb = getVertexBuffer(gl, [-200,-200, 200,-200, 0,200], 2);
	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);
    // (position, size, type, normalize, stride, offset)

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix2fv(program.u_transform, false, [1,0,0,1]);
    gl.uniform2f(program.u_translate, gl.canvas.width/2, gl.canvas.height/2);

    render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	// gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.TRIANGLES, 0, vb.numItems);
}

window.addEventListener("mousemove", event => {
	var x = event.clientX / gl.canvas.width;
	var y = (gl.canvas.height - event.clientY) / gl.canvas.height;
	var matrix = [Math.cos(3*x),-Math.sin(3*y), Math.sin(3*x),Math.cos(3*y)];
	gl.uniformMatrix2fv(program.u_transform, false, matrix);
    render();
});

function matmul2D(A,B) {
	return [A[0]*B[0]+A[1]*B[2], A[0]*B[1]+A[1]*B[3],
			A[2]*B[0]+A[3]*B[1], A[2]*B[1]+A[3]*B[3]];
}