
export var makeText = {};

makeText.simple = function (message, fontSize, resolution, center)
{
	var font = "coffee";
	font = fontSize + "px " + font;
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = font;
	ctx.canvas.width  = resolution;// | window.innerWidth;
	ctx.canvas.height = resolution;// | window.innerHeight;
	ctx.font = font;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	if (!center) {
		ctx.fillText(message, ctx.canvas.width / 2 | 0, ctx.canvas.height - fontSize);
	} else {
		ctx.fillText(message, ctx.canvas.width / 2 | 0, ctx.canvas.height / 2 | 0);
	}
	return ctx.canvas;
};

makeText.color = function (message, font, fontSize, scale, colors)
{
	font = font || "coffee";
	font = fontSize + "px " + font;
	scale = scale || [0.01, 0.01];
	var ctx = document.createElement("canvas").getContext("2d");
	ctx.font = font;
	ctx.canvas.width  = gl.drawingBufferWidth;//Math.ceil(ctx.measureText(message).width) + 2;
	ctx.canvas.height = gl.drawingBufferHeight;//fontSize + 10;
	ctx.font = font;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	var maxWidth = 20;
	var lineHeight = fontSize;
	var words = message.split('\n');
	var line = '';

	colors = colors || [];
	if (colors.length == 0) {
		for (var i = 0; i < words.length; ++i) {
			colors.push("white");
		}
	}

	var x = ctx.canvas.width / 2;// | 0;
	var y = ctx.canvas.height / 2 - Math.max(0, words.length - 1) * lineHeight / 2;// | 0;

	for(var n = 0; n < words.length; n++) {
		// var testLine = line + words[n] + ' ';
		// if (n > 0) {
			line = words[n];
			ctx.fillStyle = colors[n];
			ctx.fillText(line, x, y);
			y += lineHeight;
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
};
