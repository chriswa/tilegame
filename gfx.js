/** @type { HTMLCanvasElement } */
export const canvas = document.getElementById('mainCanvas')
export const gl = canvas.getContext('webgl2', {
	antialias: false,
})

if (!gl) {
	alert(`Sorry!\n\nYour browser does not support WebGL2.\n\nTry Chrome.`)
}

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

export function clear() {
	twgl.resizeCanvasToDisplaySize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0.3, 0.5, 0.8, 1)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}


