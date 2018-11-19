var gl, program, ms, cam, objects, m;

function initiate() {
    gl = GLinit(createCanvas("canvas", window.innerWidth, window.innerHeight));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_transform"]);
    cam = new Camera([1,1,1], [0,0,0], [0,0,1], Math.PI/2, gl.canvas.width/gl.canvas.height, 0.1, 8);
    ms = new MatrixStack(scale(identityMatrix4(),0.1));
    objects = [new Shape(gl,"cube")];
    vertexArrayInit(gl, objects);
    m = new Mouse();

    gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
    render();
}

window.addEventListener("mousemove", event => {
    //m.x = (gl.canvas.width - 2*event.clientX) / gl.canvas.width;
    //m.y = (gl.canvas.height - 2*event.clientY) / gl.canvas.height;
    m.x = 1-(gl.canvas.width - event.clientX) / gl.canvas.width;
    m.y = 1-(gl.canvas.height - event.clientY) / gl.canvas.height;
    cam.position = [Math.cos(3*m.x), Math.sin(3*m.x), 0.2];
    //cam.position = [0.5,0.5,m.x];
    //cam.position = [m.x,m.y,0.2];
    cam.update();
    render();
});

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    function drawObject(i) {
        ms.pushMatrix(); {
            ms.scale(m.y);
            ms.matmul(cam.VPMatrix);
            //gl.bindBuffer(gl.ARRAY_BUFFER, objects[i].vertexBuffer);
            gl.uniformMatrix4fv(program.u_transform, false, ms.getMatrix());
            gl.drawArrays(objects[i].vertexBuffer.defaultPrimitive, 0, objects[i].vertexBuffer.numItems);
        } ms.popMatrix();
    }

    var t = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    var rec = 0;

    function bringOutTheBois() {
        for (var i = 0; i < 6; i++) {
            ms.pushMatrix();
            rec += 1;
                ms.scale(m.y);
                ms.translate(scaleV3(t[i], 0.4*m.x*rec));
                //ms.scale(m.y*rec);
                //drawObject(0);
                if (rec < 5) bringOutTheBois();
                else drawObject(0);
            ms.popMatrix();
            rec -= 1;
        }
    }
    //drawObject(0);
    bringOutTheBois();
}

// window.addEventListener("mousedown", event => { drag = true; });
// window.addEventListener("mouseup", event => { drag = false; });


window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp": cam.zTarget = matvecmul4(rotate(cam.getCameraMatrix(),'x',-0.1),cam.zHat); break;
        case "ArrowDown": cam.VPMatrix = rotate(cam.VPMatrix,'x',0.1); break;
        case "ArrowRight": cam.VPMatrix = rotate(cam.VPMatrix,'y',0.1); break;
        case "ArrowLeft": cam.VPMatrix = rotate(cam.VPMatrix,'y',-0.1); break;
        case 'w': cam.position = subV3(cam.position, scaleV3(cam.zHat,0.03)); cam.update(); break;
        case 's': cam.position = addV3(cam.position, scaleV3(cam.zHat,0.03)); cam.update(); break;
    }
    cam.update();
    render();
});