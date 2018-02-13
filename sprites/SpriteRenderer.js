import gl from '../gl.js'

const shaderAttributeOrder = ['a_instancePackedInt1', 'a_instancePackedInt2']

const vertexShaderSource = `#version 300 es
	precision mediump float;

	uniform mat4 u_worldViewProjection;
	uniform ivec2 u_textureSize;
	in ivec4 a_instancePackedInt1;
	in ivec2 a_instancePackedInt2;
	out vec2 v_texcoord;
	out float v_brightness;

	void main() {

		float x = float((a_instancePackedInt1[0] >> 0) & 0xffff);
		float y = float((a_instancePackedInt1[1] >> 0) & 0xffff);
		float w = float((a_instancePackedInt1[2] >> 0) & 0xffff);
		float h = float((a_instancePackedInt1[3] >> 0) & 0xffff);
		float u = float((a_instancePackedInt2[0] >> 0) & 0xffff);
		float v = float((a_instancePackedInt2[1] >> 0) & 0xffff);


		// detemine corner from gl_VertexID!
		int cornerId = gl_VertexID % 4;
		float cornerX = float(((cornerId + 1) & 2) >> 1);
		float cornerY = float((cornerId & 2) >> 1);
		float dx = w * cornerX;
		float dy = h * cornerY;

		vec4 position = vec4(
			float(x + dx),
			float(y + dy),
			0.,
			1.
		);

		vec2 texcoord = vec2(
			(u + dx) / float(u_textureSize.x),
			(v + dy) / float(u_textureSize.y)
		);

		float brightness = 1.;

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

const programInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource], shaderAttributeOrder)

const indexBufferGlType = gl.UNSIGNED_SHORT
const indexBuffer = twgl.createBufferFromTypedArray(gl, new Uint16Array([ 0, 1, 2, 0, 2, 3 ]), gl.ELEMENT_ARRAY_BUFFER)




const vertsPerQuad = 4
const trianglesPerQuad = 2
export const elementsPerInstance = 6

export function createVao(numQuads, glBuffer) {
	const stride = Uint32Array.BYTES_PER_ELEMENT * elementsPerInstance
	const bufferInfo = {
		numElements: numQuads * 6,
		indices: indexBuffer,
		elementType: indexBufferGlType,
		attribs: {
			a_instancePackedInt1: { buffer: glBuffer, numComponents: 4, type: gl.INT, stride: stride, divisor: 1, offset: 0, },
			a_instancePackedInt2: { buffer: glBuffer, numComponents: 2, type: gl.INT, stride: stride, divisor: 1, offset: Uint32Array.BYTES_PER_ELEMENT * 4, },
		},
	}
	const vaoInfo = twgl.createVertexArrayInfo(gl, [programInfo], bufferInfo)
	return vaoInfo
}

export function render(cameraOrigin, cameraZoom, spriteGroups) {
	gl.useProgram(programInfo.program)

	const scaleVector = twgl.v3.create(cameraZoom, cameraZoom, 1)
	const translation = twgl.v3.create(-cameraOrigin[0], -cameraOrigin[1], 0)
	const matrix = twgl.m4.ortho(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, -1000, 1000)
	twgl.m4.scale(matrix, scaleVector, matrix)
	twgl.m4.translate(matrix, translation, matrix)
	twgl.setUniforms(programInfo, { u_worldViewProjection: matrix })
	
	for (var i = 0; i < spriteGroups.length; i += 1) {
		const spriteGroup = spriteGroups[i]
		spriteGroup.drawQuads(programInfo)
	}

}
