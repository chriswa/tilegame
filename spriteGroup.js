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
		this.quadCount = 0
		this.quadHoles = []
	}
	acquireQuad() {
		let quadId
		if (this.quadHoles.length) {
			quadId = this.quadHoles.pop()
			return quadId
		}
		else if (this.quadCount < this.maxQuads) {
			quadId = this.quadCount
			this.quadCount += 1
			return quadId
		}
		else {
			throw new Error(`SpriteGroup.acquireQuad: no more quads!`)
		}
	}
	releaseQuad(quadId) {
		this.quadHoles.push(quadId)
		this.writeQuad(quadId, 0, 0, 0, 0, 0, 0)
	}
	writeQuad(quadId, x, y, w, h, u, v) {
		const index = quadId * spriteRenderer.elementsPerInstance
		this.instanceArray[index + 0] = x
		this.instanceArray[index + 1] = y
		this.instanceArray[index + 2] = w
		this.instanceArray[index + 3] = h
		this.instanceArray[index + 4] = u
		this.instanceArray[index + 5] = v
	}
	drawQuads(programInfo) {
		// OPTIMIZE: only write array if it's changed. only write up to the quadCount. only write the part of the array that has changed
		gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceArray)
		//	this.minDirtyQuad * geometrics.quadVertexByteSize * 4, // dstByteOffset
		//	this.vertexArray,
		//	this.minDirtyQuad * geometrics.quadVertexByteSize, // srcOffset
		//	quadPushCount * geometrics.quadVertexByteSize // length (bytes)
		//)

		twgl.setUniforms(programInfo, { u_texture: this.texture, u_textureSize: [this.textureWidth, this.textureHeight] })
		twgl.setBuffersAndAttributes(gl, programInfo, this.vaoInfo)
		twgl.drawBufferInfo(gl, this.vaoInfo, gl.TRIANGLES, 6, 0, this.quadCount)
	}
}
