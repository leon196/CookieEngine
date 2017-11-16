
uniform sampler2D spritesheet;
uniform float time;
uniform vec2 spritesheetFrame;
varying vec3 vSeed;
varying vec2 vUv;

void main()	{
	vec2 uv = vUv;
	vec2 count = vec2(8,8);
	float speed = .01;
	vec2 size = spritesheetFrame / count;
	vec2 frame = size / spritesheetFrame;
	uv *= frame;
	uv.y += 1. - 1./frame.y;
	uv += floor((vSeed.xy+time*speed)*count)/count;
	vec4 color = texture2D(spritesheet, uv);
	gl_FragColor = color;
}
