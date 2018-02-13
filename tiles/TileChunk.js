import * as TileRenderer from './TileRenderer.js'
import * as TileChunkGen from './TileChunkGen.js'
import * as TileMetrics from './TileMetrics.js'

export default class TileChunk {

	constructor(chunkPos) {
		this.chunkPos = twgl.v3.copy(chunkPos)
		this.worldTilePos = twgl.v3.mulScalar(this.chunkPos, TileMetrics.chunkSize)
		this.worldPos = twgl.v3.mulScalar(this.chunkPos, TileMetrics.chunkSize * TileMetrics.tileSize)

		this.vertexArray = TileRenderer.createVertexArray()

		this.tileArray = TileChunkGen.generate(this.worldTilePos)

		this.drawQuads() // do this before calling TileRenderer.createChunkBuffer

		this.glBuffer = TileRenderer.createChunkBuffer(this.vertexArray)
		this.vaoInfo = TileRenderer.createChunkVao(this.glBuffer)
	}

	drawQuads() {
		const quadCornerOffsets = [[0, 0], [1, 0], [1, 1], [0, 1]]
		let vertexArrayIndex = 0
		for (let ty = 0; ty < TileMetrics.chunkSize; ty += 1) {
			for (let tx = 0; tx < TileMetrics.chunkSize; tx += 1) {
				for (let vertex = 0; vertex < 4; vertex += 1) {
					const tileData = this.tileArray[tx + ty * TileMetrics.chunkSize]
					const textureX = (tileData % TileRenderer.textureTileAcross)
					const textureY = Math.floor(tileData / TileRenderer.textureTileAcross)
					this.vertexArray[vertexArrayIndex + 0] = textureX + quadCornerOffsets[vertex][0]
					this.vertexArray[vertexArrayIndex + 1] = textureY + quadCornerOffsets[vertex][1]
					vertexArrayIndex += 2
				}
			}
		}
	}

}
