var gl, program, cam, vb, ms, x, y, drag;

function initiate() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_transform"]);
    cam = new Camera([0,0,1], [0,0,0], [0.01,0,1], Math.PI/2, gl.canvas.width/gl.canvas.height, 0.1, 3);
    ms = new MatrixStack();

    cubeVertices = [1,0,0, 0,0,0, 1,1,0, 0,1,0, 0,1,1, 0,0,0, 0,0,1,
                    1,0,0, 1,0,1, 1,1,0, 1,1,1, 0,1,1, 1,0,1, 0,0,1];
    for (var i = 0; i < cubeVertices.length; i++) cubeVertices[i] -= 0.5;

    vb = getVertexBuffer(gl, cubeVertices, 3, "TRIANGLE_STRIP");
    
    // for each model/geometry:
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    // for each attribute:
    gl.enableVertexAttribArray(program.a_vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.vertexAttribPointer(program.a_vertexPosition, vb.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    ms.scale(0.15);
    x = 0;  y = 0;
    drag = false;

    render();
}

window.addEventListener("mousemove", event => {
    if (drag) {
        x = (gl.canvas.width - 2*event.clientX) / gl.canvas.width;
        y = (gl.canvas.height - 2*event.clientY) / gl.canvas.height;
        var R = 1;
        cam.position = [R*Math.cos(3*x), R*Math.sin(3*x), 0.5];
        //cam.position = [0.5,0.5,x];
        //cam.position = [x,y,0.2];
        cam.setUnitVectors();
        render();
    }
});

window.addEventListener("mousedown", event => { drag = true; });
window.addEventListener("mouseup", event => { drag = false; });


/*
window.addEventListener("keydown", event => {
    var delta;
    switch (event.key) {
        case "ArrowUp": delta = scaleV3(cam.zHat,-0.1); break;
        case "ArrowDown": delta = scaleV3(cam.zHat,0.1); break;
        case "ArrowRight": delta = [Math.cos(0.1),Math.sin(0.1),0]; break;
        case "ArrowLeft": delta = [Math.cos(0.1),-Math.sin(0.1),0]; break;
        default: delta = [0,0,0];
    }
    console.log(delta);
    cam.position = addV3(cam.position, delta);
    cam.setUnitVectors();
    render();
});
*/

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    /*
    for (var i = 0; i < objects.length; i++) {
        ms.pushMatrix();
            ms.matmul(objects[i].transform);
            drawObject();
        ms.popMatrix();
    }
    */
    ms.pushMatrix(); {
        //ms.rotate('y',5*x);
        ms.translate([0,0,-y/2]);
        drawObject();
    } ms.popMatrix();

    ms.pushMatrix(); {
        //ms.rotate('y',5*x);
        ms.translate([-y/2,0,0]);
        drawObject();
    } ms.popMatrix();

    ms.pushMatrix(); {
        //ms.rotate('x',-5*x);
        ms.translate([0,-y/2,0]);
        drawObject();
    } ms.popMatrix();

    ms.pushMatrix(); {
        ms.rotate('x',5*y);
        //ms.rotate('y',5*y);
        //ms.rotate('z',5*y);
        //ms.scale(0.5);
        //ms.translate([x,y,0]);
        drawObject();
    } ms.popMatrix();

    ms.pushMatrix(); {
        //ms.rotate('x',5*x);
        ms.translate([0,y/2,0]);
        drawObject();
    } ms.popMatrix();
    
    ms.pushMatrix(); {
        //ms.rotate('y',-5*x);
        ms.translate([y/2,0,0]);
        drawObject();
    } ms.popMatrix();

    ms.pushMatrix(); {
        //ms.rotate('y',5*x);
        ms.translate([0,0,y/2]);
        drawObject();
    } ms.popMatrix();
}

function drawObject() {
    ms.pushMatrix(); {
        //ms.scale(y);
        ms.matmul(cam.getViewMatrix());
        ms.matmul(cam.getPerspective());
        gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
        gl.drawArrays(vb.defaultPrimitive, 0, vb.numItems);
    } ms.popMatrix();
}