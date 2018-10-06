

function createCanvas(id, w, h) {
    var canvas = document.createElement(id);
    canvas.width = w;  canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}

function GLinit(canvas, depthTest=true) {
    var gl = canvas.getContext("webgl2");
    if (!gl) gl = canvas.getContext("webgl");
    if (!gl) gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("Failed to initialize WebGL.");
        return null;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (depthTest) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
    }
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}

function getShader(gl, id) {
    var shaderSrc = document.getElementById(id);
    if (!shaderSrc) {
        console.error("Failed to get element ", id);
        return null;
    }
    var str = "";
    var k = shaderSrc.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderSrc.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderSrc.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        console.error("Invalid shader type!");
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Compile error: ", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function getVertexBuffer(gl, vertices, isize, defprim) {
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    buf.itemSize = isize;
    buf.numItems = vertices.length / isize;
    if (buf.numItems % 1 != 0) {
        console.error("Item size does not match up with array length!");
        return null;
    }
    buf.defaultPrimitive = gl[defprim];
    return buf;
}

function vertexArrayInit(gl, objects) {
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    for (var i = 0; i < objects.length; i++) {
        gl.enableVertexAttribArray(program.a_vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, objects[i].vertexBuffer);
        gl.vertexAttribPointer(program.a_vertexPosition,
                objects[i].vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
}

function setupProgram(gl, shaders) {
    var prog = gl.createProgram();
    for (var i = 0; i < shaders.length; i++) {
        gl.attachShader(prog, shaders[i]);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(prog));
        return null;
    }
    gl.validateProgram(prog);
    if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(prog));
        return null;
    }
    gl.useProgram(prog);
    return prog;
}

function getLocations(gl, prog, list) {
    for (var i = 0; i < list.length; i++) {
        var str = list[i];
        if (str[0] == 'a') prog[str] = gl.getAttribLocation(prog, str);
        else if (str[0] == 'u') prog[str] = gl.getUniformLocation(prog, str);
        else {
            console.error("Invalid data type!");
            return null;
        }
    }
}

function Shape(gl, type) {
    switch(type) {
        case "cube": {
            this.vertexBuffer = getVertexBuffer(gl, getVertices("cube"), 3, "TRIANGLE_STRIP");
            break;
        }
        default: return null;
    }
}

function getVertices(type) {
    switch(type) {
        case "cube": return [0.5,-0.5,-0.5, -0.5,-0.5,-0.5, 0.5,0.5,-0.5, -0.5,0.5,-0.5,
                            -0.5,0.5,0.5, -0.5,-0.5,-0.5, -0.5,-0.5,0.5, 0.5,-0.5,-0.5,
                            0.5,-0.5,0.5, 0.5,0.5,-0.5, 0.5,0.5,0.5, -0.5,0.5,0.5,
                            0.5,-0.5,0.5, -0.5,-0.5,0.5];
        default: return null;
    }
}


function Camera(pos, trgt, up, t, a, near, far) {
    this.position = pos;
    this.zTarget = trgt;
    this.upwards = up;
    this.theta = t;
    this.aRatio = a; // aspect ratio
    this.zNear = near;
    this.zFar = far;  

    this.updateUnitVectors = function() {
        this.zHat = normV3(subV3(this.position, this.zTarget));
        var cross1 = cross(this.upwards, this.zHat);
        if (magV3(cross1) != 0) this.xHat = normV3(cross1);
        this.yHat = normV3(cross(this.zHat, this.xHat));
    }

    this.updateViewMatrix = function() {
        // view matrix = inverse of the camera matrix
        this.viewMatrix = inverse(
                [this.xHat[0], this.xHat[1], this.xHat[2], 0,
                this.yHat[0], this.yHat[1], this.yHat[2], 0,
                this.zHat[0], this.zHat[1], this.zHat[2], 0,
                this.position[0], this.position[1], this.position[2], 1]);
    }

    this.updateVPMatrix = function() {
        // view-perspective matrix
        var right = Math.tan(this.theta/2)*this.zNear;
        var top = right/this.aRatio;
        this.VPMatrix = matmul(
                [this.zNear/right,0,0,0, 0,this.zNear/top,0,0,
                0,0,(this.zFar+this.zNear)/(this.zNear-this.zFar),-1,
                0,0,2*this.zFar*this.zNear/(this.zNear-this.zFar),0],
                this.viewMatrix);
    }

    this.update = function() {
        this.updateUnitVectors();
        this.updateViewMatrix();
        this.updateVPMatrix();
    }
    // initialization
    this.xHat = [1,0,0]; // default
    this.update();
}

function Mouse() {
    this.x = 0;
    this.y = 0;
    this.pressed = false;
}


/*
gl.uniform1f (floatUniformLoc, v);                 // for float
gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
gl.uniform2f (vec2UniformLoc,  v0, v1);            // for vec2
gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // for vec2 or vec2 array
gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // for vec3
gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // for vec3 or vec3 array
gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // for vec4
gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // for vec4 or vec4 array
 
gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
 
gl.uniform1i (intUniformLoc,   v);                 // for int
gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
gl.uniform2i (ivec2UniformLoc, v0, v1);            // for ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // for ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
 
gl.uniform1i (sampler2DUniformLoc,   v);           // for sampler2D (textures)
gl.uniform1iv(sampler2DUniformLoc, [v]);           // for sampler2D or sampler2D array
 
gl.uniform1i (samplerCubeUniformLoc,   v);         // for samplerCube (textures)
gl.uniform1iv(samplerCubeUniformLoc, [v]);         // for samplerCube or samplerCube array
*/