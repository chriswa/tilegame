import * as spriteRenderer from './spriteRenderer.js'
import * as gfx from './gfx.js'
/** @type { WebGLRenderingContext } */
const gl = gfx.gl

const vertsPerQuad = 4


export default class SpriteGroup {
	constructor(maxQuads_, textureSrc_, textureWidth_, textureHeight_) {
		this.maxQuads = maxQuads_
		this.texture = twgl.createTexture(gl, {
			src: textureSrc_,
			mag: gl.NEAREST,
			min: gl.NEAREST,
			level: 0,
			auto: false,
			crossOrigin: 'anonymous',
		})
		this.textureWidth = textureWidth_
		this.textureHeight = textureHeight_
		this.instanceArray = new Uint32Array(this.maxQuads * spriteRenderer.elementsPerInstance)
		this.glBuffer = twgl.createBufferFromTypedArray(gl, this.instanceArray, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)
		this.vaoInfo = spriteRenderer.createVao(this.maxQuads, this.glBuffer)
	}
	flushToGPU() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceArray)
		//	this.minDirtyQuad * geometrics.quadVertexByteSize * 4, // dstByteOffset
		//	this.vertexArray,
		//	this.minDirtyQuad * geometrics.quadVertexByteSize, // srcOffset
		//	quadPushCount * geometrics.quadVertexByteSize // length (bytes)
		//)
	}
	drawQuads(programInfo) {
		twgl.setUniforms(programInfo, { u_texture: this.texture, u_textureSize: [this.textureWidth, this.textureHeight] })
		twgl.setBuffersAndAttributes(gl, programInfo, this.vaoInfo)
		twgl.drawBufferInfo(gl, this.vaoInfo, gl.TRIANGLES, 6, 0, this.maxQuads)
	}
}
