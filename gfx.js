import gl from './gl.js'

export function clear() {
	twgl.resizeCanvasToDisplaySize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0.3, 0.5, 0.8, 1)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}


