/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/
import {o3djs} from "./base";
import Matrix4x4 from "./matrix4x4";
import {Camera} from "./camera";

let datapoints = [];

let ANALYSISTYPE_FREQUENCY 		= 0;
let ANALYSISTYPE_SONOGRAM 		= 1;
let ANALYSISTYPE_3D_SONOGRAM 	= 2;
let ANALYSISTYPE_WAVEFORM 		= 3;

// The "model" matrix is the "world" matrix in Standard Annotations and Semantics
let model:any 		= 0;
let view:any 		= 0;
let projection:any 	= 0;

function createGLErrorWrapper(context, fname) {
	return function() {
		let rv = context[fname].apply(context, arguments);
		let err = context.getError();
		if (err !== 0)
			throw "GL error " + err + " in " + fname;
		return rv;
	};
}

import "./shader";

function create3DDebugContext(context) {
	// Thanks to Ilmari Heikkinen for the idea on how to implement this so elegantly.
	let wrap:any = {};
	for (let i in context) {
		try {
			if (typeof context[i] === 'function') {
				wrap[i] = createGLErrorWrapper(context, i);
			} else {
				wrap[i] = context[i];
			}
		} catch (e) {
			// console.log("create3DDebugContext: Error accessing " + i);
		}
	}
	wrap.getError = function() {
		return context.getError();
	};
	return wrap;
}

/**
 * Class AnalyserView
 */

export const AnalyserView:any = function(canvas) {
	// NOTE: the default value of this needs to match the selected radio button

	// This analysis type may be overriden later on if we discover we don't support the right shader features.
	this.analysisType = ANALYSISTYPE_3D_SONOGRAM;

	this.sonogram3DWidth = 256;
	this.sonogram3DHeight = 256;
	this.sonogram3DGeometrySize = 9.5;

	this.freqByteData = 0;
	this.texture = 0;
	this.TEXTURE_HEIGHT = 256;
	this.yoffset = 0;

	this.frequencyShader = 0;
	this.waveformShader = 0;
	this.sonogramShader = 0;
	this.sonogram3DShader = 0;

	// Background color
	this.backgroundColor = [.08, .08, .08, 1];
	this.foregroundColor = [0,.7,0,1];

	this.canvas = canvas;
  AnalyserView.cameraController = new Camera(this.canvas);
	this.initGL();
	this.data = [];

};

AnalyserView.prototype.getAvailableContext = function(canvas, contextList) {
	if (canvas.getContext) {
		for(let i = 0; i < contextList.length; ++i) {
			try {
				let context = canvas.getContext(contextList[i], { antialias:true });
				if(context !== null)
					return context;
			} catch(ex) { }
		}
	}
	return null;
};

AnalyserView.prototype.initGL = function() {
	model 		= new Matrix4x4();
	view 		= new Matrix4x4();
	projection 	= new Matrix4x4();
	// ________________________________________
	let sonogram3DWidth = this.sonogram3DWidth;
	let sonogram3DHeight = this.sonogram3DHeight;
	let sonogram3DGeometrySize = this.sonogram3DGeometrySize;
	let backgroundColor = this.backgroundColor;
	// ________________________________________
	let canvas = this.canvas;
	// ________________________________________
	let gl = this.getAvailableContext(canvas, ['webgl', 'experimental-webgl']);
	this.gl = gl;

	// If we're missing this shader feature, then we can't do the 3D visualization.
	this.has3DVisualizer = (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0);

	if (!this.has3DVisualizer && this.analysisType === ANALYSISTYPE_3D_SONOGRAM)
		this.analysisType = ANALYSISTYPE_FREQUENCY;

	let cameraController = AnalyserView.cameraController;
	this.cameraController = cameraController;


	cameraController.xRot = -180;
	cameraController.yRot = 270;
	cameraController.zRot = 90;

	cameraController.xT = 0;
	// Zoom level.
	cameraController.yT = -2;
	// Translation in the x axis.
	cameraController.zT = -2;

	gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
	gl.enable(gl.DEPTH_TEST);

	// Initialization for the 2D visualizations
	let vertices = new Float32Array([
		1.0,   1.0,   0.0,
		-1.0,   1.0,   0.0,
		-1.0,   -1.0,   0.0,
		1.0,   1.0,   0.0,
		-1.0,   -1.0,   0.0,
		1.0,   -1.0,   0.0]);
	let texCoords = new Float32Array([
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0]);

	let vboTexCoordOffset = vertices.byteLength;
	this.vboTexCoordOffset = vboTexCoordOffset;

	// Create the vertices and texture coordinates
	let vbo = gl.createBuffer();
	this.vbo = vbo;

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER,
		vboTexCoordOffset + texCoords.byteLength,
		gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
		gl.bufferSubData(gl.ARRAY_BUFFER, vboTexCoordOffset, texCoords);

	// Initialization for the 3D visualizations
	let numVertices = sonogram3DWidth * sonogram3DHeight;
	if (numVertices > 65536) {
		throw "Sonogram 3D resolution is too high: can only handle 65536 vertices max";
	}
	vertices = new Float32Array(numVertices * 3);
	texCoords = new Float32Array(numVertices * 2);

	for (let z = 0; z < sonogram3DHeight; z++) {
		for (let x = 0; x < sonogram3DWidth; x++) {
			// Generate a reasonably fine mesh in the X-Z plane
			vertices[3 * (sonogram3DWidth * z + x) + 0] =
			sonogram3DGeometrySize * (x - sonogram3DWidth / 2) / sonogram3DWidth;
			vertices[3 * (sonogram3DWidth * z + x) + 1] = 0;
			vertices[3 * (sonogram3DWidth * z + x) + 2] = sonogram3DGeometrySize * (z - sonogram3DHeight / 2) / sonogram3DHeight;

			texCoords[2 * (sonogram3DWidth * z + x) + 0] = x / (sonogram3DWidth - 1);
			texCoords[2 * (sonogram3DWidth * z + x) + 1] = z / (sonogram3DHeight - 1);
		}
	}

	let vbo3DTexCoordOffset = vertices.byteLength;
	this.vbo3DTexCoordOffset = vbo3DTexCoordOffset;

	// Create the vertices and texture coordinates
	let sonogram3DVBO = gl.createBuffer();
	this.sonogram3DVBO = sonogram3DVBO;

	gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
	gl.bufferData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset + texCoords.byteLength, gl.STATIC_DRAW);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
	gl.bufferSubData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset, texCoords);

	// Now generate indices
	let sonogram3DNumIndices = (sonogram3DWidth - 1) * (sonogram3DHeight - 1) * 6;
	this.sonogram3DNumIndices = sonogram3DNumIndices - (6 * 600);

	let indices = new Uint16Array(sonogram3DNumIndices);
	// We need to use TRIANGLES instead of for example TRIANGLE_STRIP
	// because we want to make one draw call instead of hundreds per
	// frame, and unless we produce degenerate triangles (which are very
	// ugly) we won't be able to split the rows.
	let idx = 0;
	for (let z = 0; z < sonogram3DHeight - 1; z++) {
		for (let x = 0; x < sonogram3DWidth - 1; x++) {
			indices[idx++] = z * sonogram3DWidth + x;
			indices[idx++] = z * sonogram3DWidth + x + 1;
			indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
			indices[idx++] = z * sonogram3DWidth + x;
			indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
			indices[idx++] = (z + 1) * sonogram3DWidth + x;
		}
	}

	let sonogram3DIBO = gl.createBuffer();
	this.sonogram3DIBO = sonogram3DIBO;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sonogram3DIBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	// Note we do not unbind this buffer -- not necessary

	// Load the shaders
	this.frequencyShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/frequency-fragment.shader");
	this.waveformShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/waveform-fragment.shader");
	this.sonogramShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/sonogram-fragment.shader");

	if (this.has3DVisualizer){
		this.sonogram3DShader = o3djs.shader.loadFromURL(gl, "bin/shaders/sonogram-vertex.shader", "bin/shaders/sonogram-fragment.shader");

	}
	console.log('this.sonogramShader', this.sonogramShader);
	console.log('this.sonogram3DShader', this.sonogram3DShader);
};

AnalyserView.prototype.initByteBuffer = function() {
	let gl = this.gl;
	let TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;

	if (!this.freqByteData || this.freqByteData.length !== this.analyser.frequencyBinCount) {
		let freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
		// console.log(freqByteData);

		this.freqByteData = freqByteData;

		// (Re-)Allocate the texture object
		if (this.texture) {
			gl.deleteTexture(this.texture);
			this.texture = null;
		}
		let texture = gl.createTexture();
		this.texture = texture;

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// TODO(kbr): WebGL needs to properly clear out the texture when null is specified
		let tmp = new Uint8Array(freqByteData.length * TEXTURE_HEIGHT);
		// console.log("tmp = " + tmp);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, freqByteData.length, TEXTURE_HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, tmp);
	}
};

AnalyserView.prototype.setAnalysisType = function(type) {
	// Check for read textures in vertex shaders.
    // be sure to uncomment the botto
	if (!this.has3DVisualizer && type === ANALYSISTYPE_3D_SONOGRAM)
		return;

	this.analysisType = type;
};

AnalyserView.prototype.analysisType = function() {
	return this.analysisType;
};

AnalyserView.prototype.doFrequencyAnalysis = function(event) {
    let freqByteData = this.freqByteData;
    // console.log("ANALYSIS");
	switch(this.analysisType) {
	case ANALYSISTYPE_FREQUENCY:
		this.analyser.smoothingTimeConstant = 0.75;
		this.analyser.getByteFrequencyData(freqByteData);
        console.log("FREQ");
		break;

	case ANALYSISTYPE_SONOGRAM:
    case ANALYSISTYPE_3D_SONOGRAM:
	this.analyser.smoothingTimeConstant = 0.1;
	this.analyser.getByteFrequencyData(freqByteData);
	// console.log(freqByteData);
	for (let i = 0; i < freqByteData.length; i++) {
		if (freqByteData[i] !== 0) {
            datapoints.push(freqByteData[i]);
		}
	}
  break;

	case ANALYSISTYPE_WAVEFORM:
		this.analyser.smoothingTimeConstant = 0.1;
		this.analyser.getByteTimeDomainData(freqByteData);
        console.log("Waveform");
		break;
	}

	this.drawGL();
	return datapoints;

};

AnalyserView.prototype.drawGL = function() {
	let canvas = this.canvas;
	let gl = this.gl;
	let vbo = this.vbo;
	let vboTexCoordOffset = this.vboTexCoordOffset;
	let sonogram3DVBO = this.sonogram3DVBO;
	let vbo3DTexCoordOffset = this.vbo3DTexCoordOffset;
	let sonogram3DGeometrySize = this.sonogram3DGeometrySize;
	let sonogram3DNumIndices = this.sonogram3DNumIndices;
	let sonogram3DWidth = this.sonogram3DWidth;
	let sonogram3DHeight = this.sonogram3DHeight;
	let freqByteData = this.freqByteData;
	let texture = this.texture;
	let TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;

	let frequencyShader = this.frequencyShader;
	let waveformShader = this.waveformShader;
	let sonogramShader = this.sonogramShader;
	let sonogram3DShader = this.sonogram3DShader;


	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	if (this.analysisType !== ANALYSISTYPE_SONOGRAM && this.analysisType !== ANALYSISTYPE_3D_SONOGRAM) {
		this.yoffset = 0;
	}

	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, this.yoffset, freqByteData.length, 1, gl.ALPHA, gl.UNSIGNED_BYTE, freqByteData);

	if (this.analysisType === ANALYSISTYPE_SONOGRAM || this.analysisType === ANALYSISTYPE_3D_SONOGRAM) {
		this.yoffset = (this.yoffset + 1) % TEXTURE_HEIGHT;
	}
	let yoffset = this.yoffset;

	// Point the frequency data texture at texture unit 0 (the default),
	// which is what we're using since we haven't called activeTexture
	// in our program

	let vertexLoc;
	let texCoordLoc;
	let frequencyDataLoc;
	let foregroundColorLoc;
	let backgroundColorLoc;
	let texCoordOffset;

	let currentShader;

	switch (this.analysisType) {
	case ANALYSISTYPE_FREQUENCY:
	case ANALYSISTYPE_WAVEFORM:
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		currentShader = this.analysisType === ANALYSISTYPE_FREQUENCY ? frequencyShader : waveformShader;
		currentShader.bind();
		vertexLoc = currentShader.gPositionLoc;
		texCoordLoc = currentShader.gTexCoord0Loc;
		frequencyDataLoc = currentShader.frequencyDataLoc;
		foregroundColorLoc = currentShader.foregroundColorLoc;
		backgroundColorLoc = currentShader.backgroundColorLoc;
		gl.uniform1f(currentShader.yoffsetLoc, 0.5 / (TEXTURE_HEIGHT - 1));
		texCoordOffset = vboTexCoordOffset;
		break;

	case ANALYSISTYPE_SONOGRAM:
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		sonogramShader.bind();
		vertexLoc = sonogramShader.gPositionLoc;
		texCoordLoc = sonogramShader.gTexCoord0Loc;
		frequencyDataLoc = sonogramShader.frequencyDataLoc;
		foregroundColorLoc = sonogramShader.foregroundColorLoc;
		backgroundColorLoc = sonogramShader.backgroundColorLoc;
		gl.uniform1f(sonogramShader.yoffsetLoc, yoffset / (TEXTURE_HEIGHT - 1));
		texCoordOffset = vboTexCoordOffset;
		break;

	case ANALYSISTYPE_3D_SONOGRAM:

		gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
		sonogram3DShader.bind();
		vertexLoc           = sonogram3DShader.gPositionLoc;
		texCoordLoc         = sonogram3DShader.gTexCoord0Loc;
		frequencyDataLoc    = sonogram3DShader.frequencyDataLoc;
		foregroundColorLoc  = sonogram3DShader.foregroundColorLoc;
		backgroundColorLoc  = sonogram3DShader.backgroundColorLoc;

		gl.uniform1i(sonogram3DShader.vertexFrequencyDataLoc, 0);

		let normalizedYOffset = this.yoffset / (TEXTURE_HEIGHT - 1);

		gl.uniform1f(sonogram3DShader.yoffsetLoc, normalizedYOffset);

		let discretizedYOffset = Math.floor(normalizedYOffset * (sonogram3DHeight - 1)) / (sonogram3DHeight - 1);

		gl.uniform1f(sonogram3DShader.vertexYOffsetLoc, discretizedYOffset);
		gl.uniform1f(sonogram3DShader.verticalScaleLoc, sonogram3DGeometrySize / 3.5 );

		// Set up the model, view and projection matrices
		projection.loadIdentity();
		projection.perspective(55 /*35*/, canvas.width / canvas.height, 1, 100);
		view.loadIdentity();
		view.translate(0, 0, -9.0 /*-13.0*/);

		// Add in camera controller's rotation
		model.loadIdentity();
		model.rotate(this.cameraController.xRot, 1, 0, 0);
		model.rotate(this.cameraController.yRot, 0, 1, 0);
		model.rotate(this.cameraController.zRot, 0, 0, 1);
		model.translate(this.cameraController.xT, this.cameraController.yT, this.cameraController.zT);

		// Compute necessary matrices
		let mvp = new Matrix4x4();
		mvp.multiply(model);
		mvp.multiply(view);
		mvp.multiply(projection);
		gl.uniformMatrix4fv(sonogram3DShader.worldViewProjectionLoc, gl.FALSE, mvp.elements);
		texCoordOffset = vbo3DTexCoordOffset;
		// console.log('model',mvp.elements);
		break;

	}

	if (frequencyDataLoc) {
		gl.uniform1i(frequencyDataLoc, 0);
	}
	if (foregroundColorLoc) {
		gl.uniform4fv(foregroundColorLoc, this.foregroundColor);
	}
	if (backgroundColorLoc) {
		gl.uniform4fv(backgroundColorLoc, this.backgroundColor);
	}

	// Set up the vertex attribute arrays
	gl.enableVertexAttribArray(vertexLoc);
	gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(texCoordLoc);
	gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);



	// Clear the render area
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Actually draw
	if (this.analysisType === ANALYSISTYPE_FREQUENCY || this.analysisType === ANALYSISTYPE_WAVEFORM || this.analysisType === ANALYSISTYPE_SONOGRAM) {
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	} else if (this.analysisType === ANALYSISTYPE_3D_SONOGRAM) {
		// Note: this expects the element array buffer to still be bound
		gl.drawElements(gl.TRIANGLES, sonogram3DNumIndices, gl.UNSIGNED_SHORT, 0);
	}

	// Disable the attribute arrays for cleanliness
	gl.disableVertexAttribArray(vertexLoc);
	gl.disableVertexAttribArray(texCoordLoc);


};

AnalyserView.prototype.setAnalyserNode = function(analyser) {
	this.analyser = analyser;
};


