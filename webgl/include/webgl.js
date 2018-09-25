

function createCanvas(id, w, h) {
    var canvas = document.createElement(id);
    canvas.width = w;  canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}

function GLinit(canvas) {
    var gl = canvas.getContext("webgl");
    if (!gl) gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("Failed to initialize WebGL.");
        return null;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // gl.viewportWidth = canvas.width;
    // gl.viewportHeight = canvas.height;
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

/*
function render(gl) {
    objectsToDraw.forEach(function(object)) {
        var programInfo = object.programInfo;
        var bufferInfo = object.bufferInfo;

        gl.useProgram(programInfo.program);
        setBuffersAndAttributes(gl, programInfo, bufferInfo);
        setUniforms(programInfo, object.uniforms);
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    }
}
*/

function Shape(gl, vertices, isize, defprim) {
    this.vertexBuffer = getVertexBuffer(gl, vertices, isize, defprim);
}

function getShape(gl, type) {
    switch(type) {
        case "box": return new Shape(gl,
                [1,0,0, 0,0,0, 1,1,0, 0,1,0, 0,1,1, 0,0,0, 0,0,1,
                 1,0,0, 1,0,1, 1,1,0, 1,1,1, 0,1,1, 1,0,1, 0,0,1],
                 3, "gl.TRIANGLE_STRIP");
        default: return null;
    }
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