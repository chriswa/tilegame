import * as tileRenderer from './tileRenderer.js'
import * as tileChunkGen from './tileChunkGen.js'
import * as tileMetrics from './tileMetrics.js'

export default class TileChunk {

	constructor(chunkPos) {
		this.chunkPos = twgl.v3.copy(chunkPos)
		this.worldPos = twgl.v3.mulScalar(this.chunkPos, tileMetrics.chunkSize)

		this.vertexArray = tileRenderer.createVertexArray()

		this.tileArray = tileChunkGen.generate(this.worldPos)

		this.drawQuads() // do this before calling tileRenderer.createChunkBuffer

		this.glBuffer = tileRenderer.createChunkBuffer(this.vertexArray)
		this.vaoInfo = tileRenderer.createChunkVao(this.glBuffer)
	}

	drawQuads() {
		const quadCornerOffsets = [[0, 0], [1, 0], [1, 1], [0, 1]]
		let vertexArrayIndex = 0
		for (let ty = 0; ty < tileMetrics.chunkSize; ty += 1) {
			for (let tx = 0; tx < tileMetrics.chunkSize; tx += 1) {
				for (let vertex = 0; vertex < 4; vertex += 1) {
					const tileData = this.tileArray[tx + ty * tileMetrics.chunkSize]
					const textureX = (tileData % tileRenderer.textureTileAcross)
					const textureY = Math.floor(tileData / tileRenderer.textureTileAcross)
					this.vertexArray[vertexArrayIndex + 0] = textureX + quadCornerOffsets[vertex][0]
					this.vertexArray[vertexArrayIndex + 1] = textureY + quadCornerOffsets[vertex][1]
					vertexArrayIndex += 2
				}
			}
		}
	}

}
