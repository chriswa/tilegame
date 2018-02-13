import * as SpriteRenderer from './SpriteRenderer.js'
import SpriteGroup from './spriteGroup.js'

const spriteGroups = []

export function init() {
}

export function render(cameraOrigin, cameraZoom) {
	SpriteRenderer.render(cameraOrigin, cameraZoom, spriteGroups)
}

export function createGroup(maxQuads, textureSrc, textureWidth, textureHeight) {
	const spriteGroup = new SpriteGroup(maxQuads, textureSrc, textureWidth, textureHeight)
	spriteGroups.push(spriteGroup)
	return spriteGroup
}
