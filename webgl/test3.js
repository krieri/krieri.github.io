var gl, program, vb;

function setup() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_resolution", "u_transform",
            "u_translate", "u_offset", "u_maxIter", "u_threshold"]);

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix2fv(program.u_transform, false, [1,0,0,1]);
    gl.uniform2f(program.u_translate, gl.canvas.width/2, gl.canvas.height/2);
    gl.uniform2f(program.u_offset, 0.0, 0.0);
    gl.uniform1f(program.u_maxIter, 100.0);
    gl.uniform1f(program.u_threshold, 6.0);

    vb = getVertexBuffer(gl, [1000,1000,  -1000,1000,   1000,-1000,  -1000,-1000], 2);

	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);

    render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vb.numItems);
}

window.addEventListener("mousemove", event => {
	var x = event.clientX / gl.canvas.width;
	var y = (gl.canvas.height - event.clientY) / gl.canvas.height;
	var matrix = [Math.cos(3*x),-Math.sin(3*y),
			 Math.sin(3*x),Math.cos(3*y)];
    matrix = matmul2D([1.5,0,0,0.75], matrix);
	gl.uniformMatrix2fv(program.u_transform, false, matrix);
    render();
});

function matmul2D(A,B) {
	return [A[0]*B[0]+A[1]*B[2], A[0]*B[1]+A[1]*B[3],
			A[2]*B[0]+A[3]*B[1], A[2]*B[1]+A[3]*B[3]];
}