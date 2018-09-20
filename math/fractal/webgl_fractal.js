var canvas, gl, program, sqVertexPosBuf, center, zoom;

function initiate() {
	canvas = createCanvas('canvas', window.innerWidth, window.innerHeight);
	gl = GLinit(canvas);
	var fragmentShader = getShader(gl, 'mandelbrot_shader');
	var vertexShader = getShader(gl, 'vertex_shader');
    program = setupProgram(gl, [fragmentShader, vertexShader]);

    program.vertexPositionAttribute = gl.getAttribLocation(program, 'a_vertexPos');
    program.u_offset = gl.getUniformLocation(program, "u_offset");
    program.u_zoom = gl.getUniformLocation(program, "u_zoom");
    program.u_maxIter = gl.getUniformLocation(program, "u_maxIter");
    program.u_threshold = gl.getUniformLocation(program, "u_threshold");

    center = [0.5, 0.5];
    zoom = 1.0;

    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    gl.uniform2f(program.u_offset, 0.0, 0.0);
    gl.uniform1f(program.u_zoom, zoom);
    gl.uniform1f(program.u_maxIter, 100.0);
    gl.uniform1f(program.u_threshold, 6.0);

    var vertices = [2.0,1.0,  -2.0,1.0,   2.0,-1.0,  -2.0,-1.0];
    sqVertexPosBuf = getVertexBuffer(gl, vertices, 2);
    render();
}

function render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, sqVertexPosBuf);
    gl.vertexAttribPointer(program.vertexPositionAttribute, sqVertexPosBuf.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, sqVertexPosBuf.numItems);
}

window.addEventListener("wheel", event => {
    zoom *= (event.deltaY > 0) ? 1.2 : 0.8;
    center[0] += zoom * (event.clientX / gl.viewportWidth - 0.5);
    center[1] -= zoom * (event.clientY / gl.viewportHeight - 0.5);
    gl.uniform1f(program.u_zoom, zoom);
    gl.uniform2f(program.u_offset, center[0], center[1]);
    render();
});

window.addEventListener("mousemove", event => {
    gl.uniform1f(program.u_maxIter, event.clientX / 50.0);
    gl.uniform1f(program.u_threshold, event.clientY / 200.0);
    render();
});
