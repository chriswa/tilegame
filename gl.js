/** @type { HTMLCanvasElement } */
const canvas = document.getElementById('mainCanvas')

/** @type { WebGLRenderingContext } */
const gl = canvas.getContext('webgl2', {
	antialias: false,
})

if (!gl) {
	alert(`Sorry!\n\nYour browser does not support WebGL2.\n\nTry Chrome?`)
}

gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

export default gl
