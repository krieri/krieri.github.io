var canvas, gl, program;

function initiate() {
	canvas = createCanvas('canvas', window.innerWidth, window.innerHeight);
	gl = GLinit(canvas);
	var vertexShader = getShader(gl, 'vertexShader');
	var fragmentShader = getShader(gl, 'fragmentShader');
    program = setupProgram(gl, [fragmentShader, vertexShader]);


    program.vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');

    getVertexBuffer(gl, [-1.0,1.0,  1.0,1.0  -1.0,-1.0,  1.0,-1.0], 2);

    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    render();
}

function render() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var fieldOfView = 45 * Math.PI / 180;
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 0.1;
	var zFar = 100.0;
	var projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

	var modelViewMatrix = mat4.create();
	mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

	var numComponents = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;


}