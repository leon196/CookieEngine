
export function simpleText(message, font, fontSize, resolution, center)//, colors)
{
	font = font || 'coffee';
	font = fontSize + 'px ' + font;
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	ctx.canvas.width = resolution;//Math.ceil(ctx.measureText(message).width) + 2;
	ctx.canvas.height = resolution;//fontSize + 10;
	ctx.font = font;
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	var maxWidth = 20;
	var words = message.split('\n');
	var line = '';

	// colors = colors || [];
	// if (colors.length == 0) {
	// 	for (var i = 0; i < words.length; ++i) {
	// 		colors.push('white');
	// 	}
	// }

	var x = ctx.canvas.width / 2;// | 0;
	var y = ctx.canvas.height / 2;// | 0;
	if (!center) {
		y = ctx.canvas.height - fontSize * 1.5;
	}
	// y -=  - Math.max(0, words.length - 1) * fontSize;

	for (var n = 0; n < words.length; n++) {
		// var testLine = line + words[n] + ' ';
		// if (n > 0) {
		line = words[n];
		// ctx.fillStyle = colors[n];
		ctx.fillText(line, x, y);
		y += fontSize;
		// } else {
		// 	line = testLine;
		// }
	}
	// ctx.fillStyle = colors[words.length - 1];
	// ctx.fillText(line, x, y);

	// ctx.fillText(message, ctx.canvas.width / 2 | 0, ctx.canvas.height / 2 | 0);

	return ctx.canvas;
	// {
	// 	texture: twgl.createTexture(gl, { src: ctx.canvas }),
	// 	scale: [ctx.canvas.width * scale[0], ctx.canvas.height * scale[1], 1],
	// };
}
