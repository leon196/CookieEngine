
export function createCanvas(options)
{
	options = options || {};
	options.font = options.font || 'arial';
	var fontSize = options.fontSize || 32;
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.canvas.width = options.width || 1024;
	ctx.canvas.height = options.height || 1024;
	ctx.font = fontSize + 'px ' + options.font;
	ctx.fillStyle = options.fillStyle || 'white';
	ctx.textAlign = options.textAlign || 'center';
	ctx.textBaseline = options.textBaseline || 'middle';
	ctx.shadowColor = "rgba(0,0,0,.5)";
	ctx.shadowBlur = 4;

	var words = options.text.split('\n');
	var line = '';

	var x = ctx.canvas.width / 2;
	var y = ctx.canvas.height / 2;

	// y = ctx.canvas.height - fontSize;
	y -= Math.max(0, words.length - 1) * fontSize / 2;

	for (var n = 0; n < words.length; n++) {
		line = words[n];
		ctx.fillText(line, x, y);
		y += fontSize;
	}

	return ctx.canvas;
}
