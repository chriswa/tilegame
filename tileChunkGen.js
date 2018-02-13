import * as tileMetrics from './tileMetrics.js'

const noise = new Noise(Math.random())

export function generate(offset) {

	const tileArray = new Uint8Array(tileMetrics.chunkArea)

	for (let tx = 0; tx < tileMetrics.chunkSize; tx += 1) {
		const sampleX = tx + offset[0]

		for (let ty = 0; ty < tileMetrics.chunkSize; ty += 1) {
			const sampleY = ty + offset[1]

			const value = noise.simplex2(sampleX / 50, sampleY / 50)
			const depth = (sampleY - 40) / 25
			
			let tile = 0
			if (value * 0.2 + depth >= 2.5) {
				//tile = 17
				tile = Math.floor(Math.random() * 5) + 17
			}
			else if (value * 1.0 + depth >= 1.2) {
				tile = 1
			}
			else if (value * 0.5 + depth >= 0.1) {
				tile = 2
			}

			const tileIndex = ty * tileMetrics.chunkSize + tx
			tileArray[tileIndex] = tile
		}
	}

	return tileArray
}
