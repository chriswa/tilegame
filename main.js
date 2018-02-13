import * as tiles from './tiles.js'
import * as sprites from './sprites.js'
import * as gfx from './gfx.js'

tiles.init()
for (let ty = 0; ty < 3; ty += 1) {
	for (let tx = 0; tx < 10; tx += 1) {
		tiles.loadChunk(twgl.v3.create(tx, ty, 0))
	}
}

const textureSrc = 'chicken.png'
const textureWidth = 176
const textureHeight = 32
const maxQuads = 10000
const spriteGroup = sprites.createGroup(maxQuads, textureSrc, textureWidth, textureHeight)
function randomizeChickens() {
	for (let i = 0, arrayIndex = 0; i < maxQuads; i += 1) {
		spriteGroup.instanceArray[arrayIndex++] = Math.floor(Math.random() * 320)
		spriteGroup.instanceArray[arrayIndex++] = Math.floor(Math.random() * 320)
		spriteGroup.instanceArray[arrayIndex++] = 16
		spriteGroup.instanceArray[arrayIndex++] = 16
		spriteGroup.instanceArray[arrayIndex++] = Math.floor(Math.random() * 8) * 16
		spriteGroup.instanceArray[arrayIndex++] = Math.floor(Math.random() * 2) * 16
	}
	spriteGroup.flushToGPU()
}
randomizeChickens()

const cameraOrigin = twgl.v3.create(0, 0, 0) // 55.001, 16.001, 0)
let cameraZoom = 1

let isMouseDown = false
document.addEventListener('mousedown', (event) => { if (event.button === 0) { isMouseDown = true } })
document.addEventListener('mouseup', (event) => { if (event.button === 0) { isMouseDown = false } })
document.addEventListener('mousemove', (event) => {
	if (isMouseDown) {
		cameraOrigin[0] -= event.movementX / cameraZoom
		cameraOrigin[1] -= event.movementY / cameraZoom
	}
})
let wheelPosition = Math.log(cameraZoom) / Math.log(2) * 5
document.addEventListener('mousewheel', (event) => {
	wheelPosition += event.wheelDelta / 120
	cameraZoom = Math.pow(2, wheelPosition / 5)
})

let lastTime = performance.now()
function mainLoop() {
	const now = performance.now()
	const dt = now - lastTime
	lastTime = now

	randomizeChickens()

	gfx.clear()
	tiles.render(cameraOrigin, cameraZoom)
	sprites.render(cameraOrigin, cameraZoom)
	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

