var gl, program, vb, ms;

function initiate() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_resolution", "u_transform"]);

    ms = new MatrixStack([2/gl.canvas.width,0,0,0, 0,2/gl.canvas.height,0,0, 0,0,0.001,0, 0,0,0,1]);

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());

    cubeVertices = [1,0,0, 0,0,0, 1,1,0, 0,1,0, 0,1,1, 0,0,0, 0,0,1,
                    1,0,0, 1,0,1, 1,1,0, 1,1,1, 0,1,1, 1,0,1, 0,0,1];
    for (var i = 0; i < cubeVertices.length; i++) {
        cubeVertices[i] -= 0.5;
        cubeVertices[i] *= 300;
    }
    vb = getVertexBuffer(gl, cubeVertices, 3, "TRIANGLE_STRIP");

	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);

    render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    gl.drawArrays(vb.defaultPrimitive, 0, vb.numItems);
}

window.addEventListener("mousemove", event => {
    x = 2*(gl.canvas.width - 2*event.clientX) / gl.canvas.width;
    y = 6.28*(gl.canvas.height - 2*event.clientY) / gl.canvas.height;
    ms.pushMatrix(); {
        ms.rotate('y', y);
        ms.rotate('x', -y);
        ms.scale(x);
        render();
    } ms.popMatrix();
});