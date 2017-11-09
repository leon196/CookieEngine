
export function simpleText(message, font, fontSize, resolution, center)
{
	font = font || 'arial';
	font = fontSize + 'px ' + font;
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	ctx.canvas.width = resolution;
	ctx.canvas.height = resolution;
	ctx.font = font;
	ctx.fillStyle = 'red';
	ctx.lineWidth = 2.;
	ctx.strokeStyle = 'white';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.shadowColor = "rgba(0,0,0,1.)";
	ctx.shadowBlur = 4;

	var words = message.split('\n');
	var line = '';

	var x = ctx.canvas.width / 2;
	var y = ctx.canvas.height / 2;

	if (!center) y = ctx.canvas.height - fontSize;
	y -= Math.max(0, words.length - 1) * fontSize / 2;

	for (var n = 0; n < words.length; n++) {
		line = words[n];
		ctx.fillText(line, x, y);
		ctx.strokeText(line, x, y);
		y += fontSize;
	}

	return ctx.canvas;
}
