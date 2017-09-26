var Key = function (code)
{
	this.down = false
	this.code = code
}

export var key = {}

key.p = new Key(80)
key.space = new Key(32)
key.left = new Key(37)
key.right = new Key(39)
key.m = new Key(77)

key.onKeyDown = function (event)
{
	for (var propertyName in key) {
		if (key.hasOwnProperty(propertyName) && key[propertyName] instanceof Key && event.keyCode == key[propertyName].code) {
			key[propertyName].down = true
		}
	}
}

key.onKeyUp = function (event)
{
	// console.log(event.keyCode)
	for (var propertyName in key) {
		if (key.hasOwnProperty(propertyName) && key[propertyName] instanceof Key && event.keyCode == key[propertyName].code) {
			key[propertyName].down = false
		}
	}
}

document.addEventListener('keydown', key.onKeyDown)
document.addEventListener('keyup', key.onKeyUp)