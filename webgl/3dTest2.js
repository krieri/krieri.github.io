var gl, program, vb, ms, m;

function setup() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_resolution", "u_transform",
            "u_translate", "u_offset", "u_maxIter", "u_threshold"]);

    ms = new MatrixStack([2/gl.canvas.width,0,0,0, 0,2/gl.canvas.height,0,0, 0,0,0.001,0, 0,0,0,1]);
    m = [0, 0];

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    gl.uniform2f(program.u_translate, gl.canvas.width/2, gl.canvas.height/2);
    gl.uniform2f(program.u_offset, 0.0, 0.0);
    gl.uniform1f(program.u_maxIter, 100.0);
    gl.uniform1f(program.u_threshold, 6.0);

    vb = getVertexBuffer(gl, [0,0,0, 300,0,0, 150,250,0, 150,250,0, 0,0,0, 150,125,300,
            150,125,300, 0,0,0, 300,0,0, 300,0,0, 150,125,300, 150,250,0], 3, "TRIANGLES");

/*
    var s = 400;
    var dy = s/(s*Math.sqrt(3));
    vb = getVertexBuffer(gl, [-s/2,-dy,-0.3*s, s/2,-dy,-0.3*s, 0,0,0.5*s,
            0,0,0.5*s, s/2,-dy,-0.3*s, 0,2*dy,-0.3*s,
            0,2*dy,-0.3*s, 0,0,0.5*s, -s/2,-dy,-0.3*s,
            -s/2,-dy,-0.3*s, s/2,-dy,-0.3*s, 0,2*dy,-0.3*s], 3);
*/
	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);

    render();
}

function drawObject(buffer) {
    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    gl.drawArrays(buffer.defaultPrimitive, 0, buffer.numItems);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    ms.pushMatrix(); {
        ms.matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, -425,0,0,1]);
        ms.rotate('x', m[0]+m[1]);
        ms.rotate('y', m[0]-m[1]);
        ms.rotate('z', m[1]-m[0]);
        drawObject(vb);
    } ms.popMatrix();

    ms.pushMatrix(); {
        ms.matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, -25,0,0,1]);
        ms.rotate('x', m[0]-m[1]);
        ms.rotate('y', m[1]-m[0]);
        ms.rotate('z', m[0]+m[1]);
        drawObject(vb);
    } ms.popMatrix();

    ms.pushMatrix(); {
        ms.matmul([1,0,0,0, 0,1,0,0, 0,0,1,0, 375,0,0,1]);
        ms.rotate('x', m[1]-m[0]);
        ms.rotate('y', m[0]+m[1]);
        ms.rotate('z', m[0]-m[1]);
        drawObject(vb);
    } ms.popMatrix();
}

window.addEventListener("mousemove", event => {
    m = [6.28*event.clientX / gl.canvas.width,
            6.28*(gl.canvas.height - event.clientY) / gl.canvas.height];
    render();
});