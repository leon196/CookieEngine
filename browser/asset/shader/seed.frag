
uniform sampler2D texture;
uniform float time, reset, textureDimension;
uniform float count, segmentsX, segmentsY;
uniform float angle, radius, height, wave, waveScale, waveOffset, twist;
varying vec2 vUv;

#define dimension textureDimension
#define segments segmentsY

void main () {

	vec2 uv = vUv;
	float unit = 1. / dimension;
	float dim = dimension * dimension;
	float index = mod(uv.x * dimension + floor(uv.y*dimension)*dimension, dim);
	float segmentMod = mod(index,segments);
	float segment = (segmentMod+step(mod(index-1.,segments),segments-1.))/segments;
	// segment = clamp(segment, 0., 1.);
	float branch = floor(index/segments);
	float node = max(0., branch-1.);
	branch /= count;
	branch *= PI2;

	float angle = segment * angle + branch;
	float radius = segment * radius;
	float height = segment * height + segment * sin(segment*wave-time+branch*waveOffset)*waveScale;
	vec3 pos = vec3(cos(angle)*radius, height, sin(angle)*radius);
	pos.xz *= rot(pos.y*twist);
	// pos = mix(vec3(0), pos, segment);

	gl_FragColor = vec4(pos, node);	


	// float index = mod(time * 10., segments.y);
	// float index = floor(uv.x * dimension) + floor(uv.y * dim);
	// float branch = floor(index/segments.y);
	// float branch = floor(index/segments.y);
	// float should = step(branch-branch, .01);
	// vec2 uv = vec2(mod(index, dimension) / dimension, floor(index/dimension)/dimension);
	// vec2 uvPrev = vec2(mod(uv.x - unit + 1., 1.), uv.y - unit * step(uv.x, 0.));
	// vec3 pos = texture2D(texture, uv).xyz;

	// vec3 dir = normalize(pos-prev);
	// pos += dir * .001 * should;
	// pos.xz *= rot(.01 * should);
	// pos = mix(pos, spawn, reset);
	// gl_FragColor = vec4(pos, 1);
	// gl_FragColor = vec4(spawn, 1);
}