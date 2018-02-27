
uniform sampler2D sequenceTexture, framebuffer;
uniform float time, reset, sequenceTextureDimension;
uniform float sequenceCount;
uniform float growAngle, growRadius, growHeight, growWave, growWaveScale, growWaveOffset, growTwist;
uniform vec2 sequenceSegments;
varying vec2 vUv;

#define dimension sequenceTextureDimension
#define segments sequenceSegments.y

void main () {

	vec2 uv = vUv;
	float unit = 1. / dimension;
	vec3 spawn = texture2D(sequenceTexture, uv).xyz;
	// vec3 pos = texture2D(framebuffer, uv).xyz;
	float dim = dimension * dimension;
	float index = mod(uv.x * dimension + floor(uv.y*dimension)*dimension, dim);
	float segment = mod(index,segments)/segments;
	float sequence = floor(index/segments);
	float node = max(0., sequence-1.);
	sequence /= sequenceCount;

	sequence *= PI2;

	float angle = segment * growAngle + sequence;// * 2. + sequence + sin(segment*10.+time) * .5;
	float radius = segment * growRadius;
	float height = segment * growHeight + sin(segment*growWave-time+sequence*growWaveOffset)*growWaveScale;
	vec3 pos = vec3(cos(angle)*radius, height, sin(angle)*radius);
	pos.xz *= rot(pos.y*growTwist);
	pos = mix(vec3(0), pos, segment);

	gl_FragColor = vec4(pos, node);	

	

	// float indexGrow = mod(time * 10., sequenceSegments.y);
	// float index = floor(uv.x * dimension) + floor(uv.y * dim);
	// float sequence = floor(index/sequenceSegments.y);
	// float sequenceGrow = floor(indexGrow/sequenceSegments.y);
	// float should = step(sequence-sequenceGrow, .01);
	// vec2 uvGrow = vec2(mod(indexGrow, dimension) / dimension, floor(indexGrow/dimension)/dimension);
	// vec2 uvPrev = vec2(mod(uvGrow.x - unit + 1., 1.), uvGrow.y - unit * step(uvGrow.x, 0.));
	// vec3 posGrow = texture2D(framebuffer, uvGrow).xyz;
	// vec3 prev = texture2D(framebuffer, uvPrev).xyz;

	// vec3 dir = normalize(posGrow-prev);
	// pos += dir * .001 * should;
	// pos.xz *= rot(.01 * should);
	// pos = mix(pos, spawn, reset);
	// gl_FragColor = vec4(pos, 1);
	// gl_FragColor = vec4(spawn, 1);
}