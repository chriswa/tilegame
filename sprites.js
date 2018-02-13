import * as spriteRenderer from './spriteRenderer.js'
import SpriteGroup from './spriteGroup.js'

const spriteGroups = []

export function init() {
}

export function render(cameraOrigin, cameraZoom) {
	spriteRenderer.render(cameraOrigin, cameraZoom, spriteGroups)
}

export function createGroup(maxQuads, textureSrc, textureWidth, textureHeight) {
	const spriteGroup = new SpriteGroup(maxQuads, textureSrc, textureWidth, textureHeight)
	spriteGroups.push(spriteGroup)
	return spriteGroup
}
