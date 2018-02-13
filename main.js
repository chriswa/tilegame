import * as tiles from './tiles.js'
import * as sprites from './sprites.js'
import Sprite from './sprite.js'
import * as gfx from './gfx.js'
const gl = gfx.gl

// TILES
// =====

tiles.init()
for (let ty = 0; ty < 2; ty += 1) {
	for (let tx = 0; tx < 3; tx += 1) {
		tiles.loadChunk(twgl.v3.create(tx, ty, 0))
	}
}

// SPRITES
// =======

const textureSrc = 'chicken.png'
const textureWidth = 176
const textureHeight = 32
const maxQuads = 1000
const spriteGroup = sprites.createGroup(maxQuads, textureSrc, textureWidth, textureHeight)
const chickens = []
for (let i = 0; i < maxQuads; i += 1) {
	const x = Math.floor(Math.random() * 16 * 120 * 3)
	const y = Math.random() * 16 * 30
	const w = 16
	const h = 16
	const u = Math.floor(Math.random() * 8) * 16
	const v = Math.floor(Math.random() * 2) * 16
	const chicken = new Sprite(spriteGroup, x, y, w, h, u, v)
	chickens.push(chicken)
}
function onUpdate(dt) {
	chickens.forEach(chicken => {
		chicken.y += dt * 0.001
		chicken.updateQuad()
	})
}

// CAMERA
// ======

twgl.resizeCanvasToDisplaySize(gl.canvas)
const cameraOrigin = twgl.v3.create(gl.canvas.width / 2, gl.canvas.height / 2, 0)
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
const cameraZoomFactor = 4
let wheelPosition = Math.log(cameraZoom) / Math.log(2) * cameraZoomFactor
document.addEventListener('mousewheel', (event) => {
	wheelPosition += event.wheelDelta / 120
	cameraZoom = Math.pow(2, wheelPosition / cameraZoomFactor)
})

// GAMELOOP
// ========

let lastTime = performance.now()
function mainLoop() {
	// calculate delta time
	const now = performance.now()
	const dt = now - lastTime
	lastTime = now

	// update
	onUpdate(dt)

	// render
	gfx.clear()
	tiles.render(cameraOrigin, cameraZoom)
	sprites.render(cameraOrigin, cameraZoom)
	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

