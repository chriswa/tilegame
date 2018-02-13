import * as TileRenderer from './TileRenderer.js'
import TileChunk from './TileChunk.js'

export const chunks = {} // {`${x},${y}`: TileChunk}

export function init() {
}

export function loadChunk(chunkPos) {
	const chunkId = `${chunkPos[0]},${chunkPos[1]}`
	this.chunks[chunkId] = new TileChunk(chunkPos)
}

export function render(cameraOrigin, cameraZoom) {
	TileRenderer.render(cameraOrigin, cameraZoom, chunks)
}
