var gl, program, ms, cam, objects, m;

function initiate() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_transform"]);
    cam = new Camera([0,0,1], [0,0,0], [0,0,1], Math.PI/2, gl.canvas.width/gl.canvas.height, 0.1, 3);
    ms = new MatrixStack(scale(identityMatrix4(),0.15));
    objects = [new Shape(gl,"cube")];
    var vao = vertexArrayInit(gl, program, objects);
    m = new Mouse();

    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    render();
}

window.addEventListener("mousemove", event => {
    m.x = (gl.canvas.width - 2*event.clientX) / gl.canvas.width;
    m.y = (gl.canvas.height - 2*event.clientY) / gl.canvas.height;
    cam.position = [Math.cos(3*m.x), Math.sin(3*m.x), 0.5];
    //cam.position = [0.5,0.5,m.x];
    //cam.position = [m.x,m.y,0.2];
    cam.update();
    render();
});

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < objects.length; i++) {
        ms.pushMatrix(); {
            //ms.rotate('y',5*m.x);
            ms.translate([0,0,-m.y/2]);
            drawObject(i);
        } ms.popMatrix();

        ms.pushMatrix(); {
            //ms.rotate('y',5*m.x);
            ms.translate([-m.y/2,0,0]);
            drawObject(i);
        } ms.popMatrix();

        ms.pushMatrix(); {
            //ms.rotate('x',-5*m.x);
            ms.translate([0,-m.y/2,0]);
            drawObject(i);
        } ms.popMatrix();

        ms.pushMatrix(); {
            ms.rotate('x',5*m.y);
            //ms.rotate('y',5*m.y);
            //ms.rotate('z',5*m.y);
            //ms.scale(0.5);
            //ms.translate([m.x,m.y,0]);
            drawObject(i);
        } ms.popMatrix();

        ms.pushMatrix(); {
            //ms.rotate('x',5*m.x);
            ms.translate([0,m.y/2,0]);
            drawObject(i);
        } ms.popMatrix();
        
        ms.pushMatrix(); {
            //ms.rotate('y',-5*m.x);
            ms.translate([m.y/2,0,0]);
            drawObject(i);
        } ms.popMatrix();

        ms.pushMatrix(); {
            //ms.rotate('y',5*m.x);
            ms.translate([0,0,m.y/2]);
            drawObject(i);
        } ms.popMatrix();
    }
}

function drawObject(i) {
    ms.pushMatrix(); {
        //ms.scale(m.y);
        ms.matmul(cam.VPMatrix);
        //gl.bindBuffer(gl.ARRAY_BUFFER, objects[i].vertexBuffer);
        gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
        gl.drawArrays(objects[i].vertexBuffer.defaultPrimitive, 0, objects[i].vertexBuffer.numItems);
    } ms.popMatrix();
}

// window.addEventListener("mousedown", event => { drag = true; });
// window.addEventListener("mouseup", event => { drag = false; });

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