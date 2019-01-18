var gl, program, objects, zoom;

function initiate() {
    gl = GLinit(createCanvas("canvas", 1500, 700));
    program = setupProgram(gl, [getShader(gl, "vertexShader"), getShader(gl, "fragmentShader")]);
    getLocations(gl, program, ["a_vertexPosition", "u_resolution", "u_mousePos", "u_zoom"]);
    objects = [new Shape(gl, "rectangle", [0,0,gl.canvas.width,gl.canvas.height])];
    var vao = vertexArrayInit(gl, program, objects);
    zoom = 1.0;

    gl.uniform2f(program.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(program.u_mousePos, 0.0, 0.0);
    gl.uniform1f(program.u_zoom, zoom);
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(objects[0].vertexBuffer.defaultPrimitive, 0, objects[0].vertexBuffer.numItems);
}

window.addEventListener("mousemove", event => {
    gl.uniform2f(program.u_mousePos, event.clientX, event.clientY);
    render();
});

window.addEventListener("wheel", event => {
    zoom -= 0.5*Math.sign(event.deltaY);
    gl.uniform1f(program.u_zoom, zoom);
    render();
});