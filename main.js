import * as tiles from './tiles.js'
import * as gfx from './gfx.js'

tiles.init()
for (let ty = 0; ty < 2; ty += 1) {
	for (let tx = 0; tx < 10; tx += 1) {
		tiles.loadChunk(twgl.v3.create(tx, ty, 0))
	}
}	

const cameraOrigin = twgl.v3.create(-55.001, -26.001, 0)
let cameraZoom = 1

let isMouseDown = false
document.addEventListener('mousedown', (event) => { if (event.button === 0) { isMouseDown = true } })
document.addEventListener('mouseup', (event) => { if (event.button === 0) { isMouseDown = false } })
document.addEventListener('mousemove', (event) => {
	if (isMouseDown) {
		cameraOrigin[0] += event.movementX / cameraZoom / 16
		cameraOrigin[1] += event.movementY / cameraZoom / 16
	}
})
let wheelPosition = Math.log(cameraZoom) / Math.log(2) * 5
document.addEventListener('mousewheel', (event) => {
	wheelPosition += event.wheelDelta / 120
	cameraZoom = Math.pow(2, wheelPosition / 5)
})

function mainLoop() {
	gfx.clear()
	tiles.render(cameraOrigin, cameraZoom)
	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

