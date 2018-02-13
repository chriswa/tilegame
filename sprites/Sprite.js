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
		this.subarray = this.spriteGroup.getSubArray(this.quadId)
		this.updateQuad()
	}
	updatePos() {
		this.subarray[0] = this.x
		this.subarray[1] = this.y
	}
	updateQuad() {
		//this.spriteGroup.writeQuad(this.quadId, this.x, this.y, this.w, this.h, this.u, this.v)
		this.subarray[0] = this.x
		this.subarray[1] = this.y
		this.subarray[2] = this.w
		this.subarray[3] = this.h
		this.subarray[4] = this.u
		this.subarray[5] = this.v
	}
}
