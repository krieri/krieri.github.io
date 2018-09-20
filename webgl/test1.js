var gl, program, vb;

function setup() {
	var canv = createCanvas("canvas", window.innerWidth, window.innerHeight);
	gl = GLinit(canv);
	var vs = getShader(gl, "vertexShader");
	var fs = getShader(gl, "fragmentShader");
    program = setupProgram(gl, [vs, fs]);

    program.a_vertexPosition = gl.getAttribLocation(program, "a_vertexPosition");
    program.u_resolution = gl.getUniformLocation(program, "u_resolution");
    program.u_color = gl.getUniformLocation(program, "u_color");

    vb = getVertexBuffer(gl, [0,0, 0,0, 0,0, 0,0, 0,0, 0,0], 2);
	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);
    // (position, size, type, normalize, stride, offset)

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);

    //render();
    randomSquares(10);
}

function render() {
	// gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.TRIANGLES, 0, vb.numItems);
}
/*
window.addEventListener("mousemove", event => {

    render();
});
*/

function randomSquares(n) {
	gl.clear(gl.COLOR_BUFFER_BIT);
	var hWidth = gl.canvas.width / 2;
	var hHeight = gl.canvas.height / 2;
	
	for (var i = 0; i < n; i++) {
		var x1 = Math.floor(Math.random() * hWidth);
		var y1 = Math.floor(Math.random() * hHeight);
		var x2 = x1 + hWidth;
		var y2 = y1 + hHeight;
		var vertices = [x1,y1, x2,y1, x1,y2, x1,y2, x2,y1, x2,y2];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.uniform4f(program.u_color, Math.random(),
				Math.random(), Math.random(), 1);
		render();
	}
}

window.onresize = function(e) {
	gl.canvas.width = gl.viewport.width = this.innerWidth;
	gl.canvas.height = gl.viewport.height = this.innerHeight;
	randomSquares(10);
}