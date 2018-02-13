const keynames = {
	87: "up",    // w
	83: "down",  // s
	65: "left",  // a
	68: "right", // d
	38: "up",
	40: "down",
	37: "left",
	39: "right",
	16: "shift",
	32: "space",
}

export const keysDown = {}
export let keysPressed = {}

export function onUpdate() {
	keysPressed = {}
}

document.addEventListener('keydown', event => {
	//console.log(event.which)
	const keyname = keynames[event.which]
	if (keyname) {
		keysDown[keyname] = true
		keysPressed[keyname] = true
	}
}, false)

document.addEventListener('keyup', event => {
	const keyname = keynames[event.which]
	if (keyname) {
		delete keysDown[keyname]
	}
}, false)
