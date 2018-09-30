var gl, program, cam, vb, ms;

function initiate() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_transform"]);

    cam = new Camera([0,0,1], [0,0,0], [0,0,1], Math.PI/2, gl.canvas.width/gl.canvas.height, 1.8, -3);
    ms = new MatrixStack();

    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());

    cubeVertices = [1,0,0, 0,0,0, 1,1,0, 0,1,0, 0,1,1, 0,0,0, 0,0,1,
                    1,0,0, 1,0,1, 1,1,0, 1,1,1, 0,1,1, 1,0,1, 0,0,1];
    for (var i = 0; i < cubeVertices.length; i++) {
        cubeVertices[i] -= 0.5;
    }

    vb = getVertexBuffer(gl, cubeVertices, 3, "TRIANGLE_STRIP");

	gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);
    
    render();
}

window.addEventListener("mousemove", event => {
    x = 2*(gl.canvas.width - 2*event.clientX) / gl.canvas.width;
    y = 0.01*6.28*(gl.canvas.height - 2*event.clientY) / gl.canvas.height;
    var R = Math.sqrt(3*4*y*y);
    cam.position = [R*Math.cos(x), R*Math.sin(x), 0.1];
    cam.setUnitVectors();
    render();
});

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    ms.pushMatrix(); {
        ms.setMatrix(cam.getViewMatrix());
        //ms.matmul(cam.getPerspective());

        ms.pushMatrix(); {
            ms.translate([-0.5,0,0]);
            drawObject();
        } ms.popMatrix();

        ms.pushMatrix(); {
            ms.translate([0,-0.5,0]);
            drawObject();
        } ms.popMatrix();

        ms.pushMatrix(); {
            ms.rotate('x',5*x);
            ms.rotate('y',5*x);
            ms.rotate('z',5*x);
            drawObject();
        } ms.popMatrix();

        ms.pushMatrix(); {
            ms.translate([0,0.5,0]);
            drawObject();
        } ms.popMatrix();
        
        ms.pushMatrix(); {
            ms.translate([0.5,0,0]);
            drawObject();
        } ms.popMatrix();
    } ms.popMatrix();
}

function drawObject() {
    ms.scale(0.3);
    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    gl.drawArrays(vb.defaultPrimitive, 0, vb.numItems);
}