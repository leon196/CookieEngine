
uniform sampler2D dataTexture, framebuffer;
uniform float time, reset, dataTextureDimension;
uniform vec2 branchSegments;
varying vec2 vUv;

#define dimension dataTextureDimension

void main () {

	vec2 uv = vUv;
	float unit = 1. / dimension;
	// vec2 uvNext = vec2(mod(uv.x + unit, 1.), uv.y + unit * step(1., uv.x + unit));
	// vec2 uvPrev = vec2(mod(uv.x - unit + 1., 1.), uv.y - unit * step(uv.x, 0.));
	// vec3 next = texture2D(framebuffer, uvNext).xyz;
	// vec3 prev = texture2D(framebuffer, uvPrev).xyz;
	vec3 spawn = texture2D(dataTexture, uv).xyz;
	vec3 pos = texture2D(framebuffer, uv).xyz;

	float dim = dimension * dimension;
	float indexGrow = mod(time * 10., branchSegments.y);
	float index = floor(uv.x * dimension) + floor(uv.y * dim);
	float branch = floor(index/branchSegments.y);
	float branchGrow = floor(indexGrow/branchSegments.y);
	float should = step(branch-branchGrow, .01);
	vec2 uvGrow = vec2(mod(indexGrow, dimension) / dimension, floor(indexGrow/dimension)/dimension);
	vec2 uvPrev = vec2(mod(uvGrow.x - unit + 1., 1.), uvGrow.y - unit * step(uvGrow.x, 0.));
	vec3 posGrow = texture2D(framebuffer, uvGrow).xyz;
	vec3 prev = texture2D(framebuffer, uvPrev).xyz;

	vec3 dir = normalize(posGrow-prev);
	pos += dir * .001 * should;
	pos.xz *= rot(.01 * should);
	// pos = pos - normalize(pos-prev) * length(pos-prev);
	pos = mix(pos, spawn, reset);
	gl_FragColor = vec4(pos, 1);
	gl_FragColor = vec4(spawn, 1);
}