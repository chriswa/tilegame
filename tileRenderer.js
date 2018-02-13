import * as tileMetrics from './tileMetrics.js'
import * as gfx from './gfx.js'
/** @type { WebGLRenderingContext } */
const gl = gfx.gl

const texture = twgl.createTexture(gl, {
	src: 'tiles.png',
	mag: gl.NEAREST,
	min: gl.NEAREST,
	level: 0,
	auto: false,
	crossOrigin: 'anonymous',
})
export const textureTileAcross = 16

const shaderAttributeOrder = [ 'a_vertexPackedInt' ]

const vertexShaderSource = `#version 300 es
	precision mediump float;

	uniform mat4 u_worldViewProjection;
	in ivec4 a_vertexPackedInt;
	out vec2 v_texcoord;
	out float v_brightness;

	void main() {

		// detemine position from gl_VertexID!
		int quadID = gl_VertexID / 4;
		int quadX = quadID % ${tileMetrics.chunkSize};
		int quadY = quadID / ${tileMetrics.chunkSize};
		int cornerId = gl_VertexID % 4;
		int cornerX = ((cornerId + 1) & 2) >> 1;
		int cornerY = (cornerId & 2) >> 1;
		vec4 position = vec4(
			float(quadX + cornerX),
			float(quadY + cornerY),
			-0.1,
			1.
		);

		// get texcoord from attributes
		vec2 texcoord = vec2(
			(float((a_vertexPackedInt[0] >> 0) & 0xffff)) / ${textureTileAcross}.,
			(float((a_vertexPackedInt[1] >> 0) & 0xffff)) / ${textureTileAcross}.
		);

		// get brightness from attributes
		float brightness = 1.; // float((a_vertexPackedInt[0] >> 0) & 0x1f) / 16.;

		gl_Position = u_worldViewProjection * position;
		v_texcoord = texcoord;
		v_brightness = brightness;
	}`

const fragmentShaderSource = `#version 300 es
	precision mediump float;

	uniform sampler2D u_texture;
	in vec2 v_texcoord;
	in float v_brightness;
	out vec4 fragColor;

	void main() {
		fragColor = texture(u_texture, v_texcoord) * vec4(v_brightness, v_brightness, v_brightness, 1.);
	}`

const programInfo = twgl.createProgramInfo(gl, [ vertexShaderSource, fragmentShaderSource ], shaderAttributeOrder)

const indexBufferGlType = gl.UNSIGNED_SHORT

function createIndexBuffer() {
	const maxQuads = tileMetrics.chunkArea
	const indexArray = new Uint16Array(maxQuads * 6)
	for (let quadIndex = 0, indexIndex = 0, vertIndex = 0; quadIndex < maxQuads; quadIndex += 1, indexIndex += 6, vertIndex += 4) {
		indexArray[indexIndex + 0] = vertIndex + 0
		indexArray[indexIndex + 1] = vertIndex + 1
		indexArray[indexIndex + 2] = vertIndex + 2
		indexArray[indexIndex + 3] = vertIndex + 0
		indexArray[indexIndex + 4] = vertIndex + 2
		indexArray[indexIndex + 5] = vertIndex + 3
	}
	return twgl.createBufferFromTypedArray(gl, indexArray, gl.ELEMENT_ARRAY_BUFFER)
}
const indexBuffer = createIndexBuffer()


const vertsPerQuad = 4
const elementsPerVert = 2
const numVerts = tileMetrics.chunkArea * vertsPerQuad
const vertexByteStride = Uint32Array.BYTES_PER_ELEMENT * elementsPerVert



export function createVertexArray() {
	return new Uint32Array(numVerts * elementsPerVert)
}

export function createChunkBuffer(vertexArray) {
	return twgl.createBufferFromTypedArray(gl, vertexArray, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)
}

export function createChunkVao(glBuffer) {
	const bufferInfo = {
		numElements: tileMetrics.chunkArea * 6,
		indices: indexBuffer,
		elementType: indexBufferGlType,
		attribs: {
			a_vertexPackedInt: { buffer: glBuffer, numComponents: elementsPerVert, type: gl.INT, stride: 0, offset: 0, },
		},
	}
	return twgl.createVertexArrayInfo(gl, [programInfo], bufferInfo)
}

export function render(cameraOrigin, cameraZoom, chunks) {
	gl.useProgram(programInfo.program)
	twgl.setUniforms(programInfo, { u_texture: texture })

	//const scaleVector = twgl.v3.create(cameraZoom * 32 / gl.canvas.width, cameraZoom * -32 / gl.canvas.height, 1)
	//const scaleMatrix = twgl.m4.scaling(scaleVector)

	const scaleVector1 = twgl.v3.create(cameraZoom, cameraZoom, 1)
	const scaleVector2 = twgl.v3.create(16, 16, 1)
	

	for (let chunkId in chunks) {
		const chunk = chunks[chunkId]

		//const translationMatrix = twgl.m4.translation(twgl.v3.create(
		//	-cameraOrigin[0] + chunk.worldPos[0],
		//	-cameraOrigin[1] + chunk.worldPos[1],
		//	0))
		//const worldViewProjectionMatrix = twgl.m4.multiply(scaleMatrix, translationMatrix)

		const translation = twgl.v3.create(-cameraOrigin[0] + chunk.worldPos[0], -cameraOrigin[1] + chunk.worldPos[1], 0)
		const matrix = twgl.m4.ortho(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, -1, 1)
		twgl.m4.scale(matrix, scaleVector1, matrix)
		twgl.m4.translate(matrix, translation, matrix)
		twgl.m4.scale(matrix, scaleVector2, matrix)

		twgl.setUniforms(programInfo, { u_worldViewProjection: matrix })
		twgl.setBuffersAndAttributes(gl, programInfo, chunk.vaoInfo)
		twgl.drawBufferInfo(gl, chunk.vaoInfo)
		//gl.drawElements(gl.TRIANGLES, tileMetrics.chunkArea * 6, indexBufferGlType, 0)

	}

	gl.bindVertexArray(null) // put gl back to normal mode!
}
