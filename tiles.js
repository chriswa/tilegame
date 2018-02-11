import * as tileRenderer from './tileRenderer.js'
import TileChunk from './tileChunk.js'

export const chunks = {} // {`${x},${y}`: TileChunk}

export function init() {
}

export function loadChunk(chunkPos) {
	const chunkId = `${chunkPos[0]},${chunkPos[1]}`
	this.chunks[chunkId] = new TileChunk(chunkPos)
}

export function render(cameraOrigin, cameraZoom) {
	tileRenderer.render(cameraOrigin, cameraZoom, chunks)
}
