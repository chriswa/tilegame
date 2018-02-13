import * as Tiles from './tiles/Tiles.js'
import * as Sprites from './sprites/Sprites.js'
import Sprite from './sprites/Sprite.js'
import * as gfx from './gfx.js'
import * as PlayerInput from './PlayerInput.js'
import gl from './gl.js'

// TILES
// =====

Tiles.init()
for (let ty = 0; ty < 2; ty += 1) {
	for (let tx = 0; tx < 3; tx += 1) {
		Tiles.loadChunk(twgl.v3.create(tx, ty, 0))
	}
}

// SPRITES
// =======

const textureSrc = 'assets/chicken.png'
const textureWidth = 176
const textureHeight = 32
const maxQuads = 10000
const spriteGroup = Sprites.createGroup(maxQuads, textureSrc, textureWidth, textureHeight)
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
function onUpdateChickens(dt) {
	chickens.forEach(chicken => {
		chicken.y += dt * 0.1
		if (chicken.y > 16 * 30) { chicken.y -= 16 * 30 }
		chicken.updatePos()
	})
}

// PLAYER
// ======

const playerSpriteGroup = Sprites.createGroup(1, textureSrc, textureWidth, textureHeight)
const player = new Sprite(playerSpriteGroup, 200, 200)
function onUpdatePlayer(dt) {
	if (PlayerInput.keysDown.up) { player.y -= dt * 0.5 }
	if (PlayerInput.keysDown.down) { player.y += dt * 0.5 }
	if (PlayerInput.keysDown.left) { player.x -= dt * 0.5 }
	if (PlayerInput.keysDown.right) { player.x += dt * 0.5 }
	player.updatePos()
	if (cameraLockedToPlayer) {
		cameraOrigin[0] = Math.floor(player.x) + 8
		cameraOrigin[1] = Math.floor(player.y) + 8
	}
}

// CAMERA
// ======

twgl.resizeCanvasToDisplaySize(gl.canvas)
const cameraOrigin = twgl.v3.create(gl.canvas.width / 2, gl.canvas.height / 2, 0)
let cameraZoom = 1

let cameraLockedToPlayer = true

let isMouseDown = false
document.addEventListener('contextmenu', event => event.preventDefault())
document.addEventListener('mousedown', event => {
	if (event.button === 0) { isMouseDown = true; cameraLockedToPlayer = false }
	if (event.button === 2) { cameraLockedToPlayer = true; event.preventDefault() }
})
document.addEventListener('mouseup', event => {
	if (event.button === 0) { isMouseDown = false }
})
document.addEventListener('mousemove', event => {
	if (isMouseDown) {
		cameraOrigin[0] -= event.movementX / cameraZoom
		cameraOrigin[1] -= event.movementY / cameraZoom
	}
})
const cameraZoomFactor = 4
let wheelPosition = Math.log(cameraZoom) / Math.log(2) * cameraZoomFactor
document.addEventListener('mousewheel', event => {
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
	onUpdateChickens(dt)
	onUpdatePlayer(dt)

	// render
	gfx.clear()
	
	const scaleVector = twgl.v3.create(cameraZoom, cameraZoom, 1)
	const translation = twgl.v3.create(-cameraOrigin[0], -cameraOrigin[1], 0)
	const worldViewProjectionMatrix = twgl.m4.ortho(-gl.canvas.width / 2 - 0.5, gl.canvas.width / 2 - 0.5, gl.canvas.height / 2 - 0.5, -gl.canvas.height / 2 - 0.5, -1000, 1000)
	twgl.m4.scale(worldViewProjectionMatrix, scaleVector, worldViewProjectionMatrix)
	twgl.m4.translate(worldViewProjectionMatrix, translation, worldViewProjectionMatrix)

	Tiles.render(worldViewProjectionMatrix)
	Sprites.render(worldViewProjectionMatrix)
	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

