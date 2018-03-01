
uniform sampler2D texture;
uniform float time, reset, textureDimension;
uniform float count;
uniform vec2 segments;
uniform float growAngle, growRadius, growHeight, growWave, growWaveScale, growWaveOffset, growTwist;
varying vec2 vUv;

#define dimension textureDimension
#define segments segments.y

void main () {

	vec2 uv = vUv;
	float unit = 1. / dimension;
	float dim = dimension * dimension;
	float index = mod(uv.x * dimension + floor(uv.y*dimension)*dimension, dim);
	float segment = mod(index,segments)/segments;
	float branch = floor(index/segments);
	float node = max(0., branch-1.);
	branch /= count;
	branch *= PI2;

	float angle = segment * growAngle + branch;
	float radius = segment * growRadius;
	float height = segment * growHeight + segment * sin(segment*growWave-time+branch*growWaveOffset)*growWaveScale;
	vec3 pos = vec3(cos(angle)*radius, height, sin(angle)*radius);
	pos.xz *= rot(pos.y*growTwist);
	// pos = mix(vec3(0), pos, segment);

	gl_FragColor = vec4(pos, node);	


	// float indexGrow = mod(time * 10., segments.y);
	// float index = floor(uv.x * dimension) + floor(uv.y * dim);
	// float branch = floor(index/segments.y);
	// float branchGrow = floor(indexGrow/segments.y);
	// float should = step(branch-branchGrow, .01);
	// vec2 uvGrow = vec2(mod(indexGrow, dimension) / dimension, floor(indexGrow/dimension)/dimension);
	// vec2 uvPrev = vec2(mod(uvGrow.x - unit + 1., 1.), uvGrow.y - unit * step(uvGrow.x, 0.));
	// vec3 posGrow = texture2D(texture, uvGrow).xyz;

	// vec3 dir = normalize(posGrow-prev);
	// pos += dir * .001 * should;
	// pos.xz *= rot(.01 * should);
	// pos = mix(pos, spawn, reset);
	// gl_FragColor = vec4(pos, 1);
	// gl_FragColor = vec4(spawn, 1);
}