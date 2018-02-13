import * as sprites from './sprites.js'

export default class Sprite {
	constructor(spriteGroup_, x_, y_, w_, h_, u_, v_) {
		this.spriteGroup = spriteGroup_
		this.quadId = this.spriteGroup.acquireQuad()
		this.x = x_ || 0
		this.y = y_ || 0
		this.w = w_ || 16
		this.h = h_ || 16
		this.u = u_ || 0
		this.v = v_ || 0
		this.updateQuad()
	}
	setPos(x_, y_) {
		this.x = x_
		this.y = y_
		this.updateQuad()
	}
	setGlyph(w_, h_, u_, v_) {
		this.w = w_
		this.h = h_
		this.u = u_
		this.v = v_
		this.updateQuad()
	}
	updateQuad() {
		this.spriteGroup.writeQuad(this.quadId, this.x, this.y, this.w, this.h, this.u, this.v)
	}
}
