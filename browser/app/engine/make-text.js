
import { Texture } from 'three.js';


function createCanvas(segments)
{
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.canvas.width = segments[0].width || 1024;
	ctx.canvas.height = segments[0].height || 1024;
	var font = segments[0].font;
	segments.forEach(segment => {
		var options = segment || {};
		var fontSize = options.fontSize || 32;
		options.font = options.font || font;
		ctx.font = fontSize + 'px ' + options.font;
		ctx.fillStyle = options.fillStyle || 'white';
		ctx.textAlign = options.textAlign || 'center';
		ctx.textBaseline = options.textBaseline || 'middle';
		ctx.shadowColor = options.shadowColor || 'rgba(0,0,0,.5)';
		ctx.shadowBlur = options.shadowBlur || 4;

		var words = options.text.split('\n');
		var line = '';

		var x = ctx.canvas.width / 2;
		var y = ctx.canvas.height / 2;

		y += options.offsetY || 0;

		// y = ctx.canvas.height - fontSize;
		y -= Math.max(0, words.length - 1) * fontSize / 2;

		for (var n = 0; n < words.length; n++) {
			line = words[n];
			ctx.fillText(line, x, y);
			y += fontSize;
		}
	})

	return ctx.canvas;
}

export function createTexture(segments)
{
	var texture = new Texture(createCanvas(segments));
	texture.needsUpdate = true;
	return texture;
}
