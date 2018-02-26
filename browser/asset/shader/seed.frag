
uniform sampler2D dataTexture, framebuffer;
uniform float time, reset, dataTextureDimension;
uniform float branchCount;
uniform vec2 branchSegments;
varying vec2 vUv;

#define dimension dataTextureDimension
#define segments branchSegments.y

void main () {

	vec2 uv = vUv;
	float unit = 1. / dimension;
	vec3 spawn = texture2D(dataTexture, uv).xyz;
	// vec3 pos = texture2D(framebuffer, uv).xyz;
	float dim = dimension * dimension;
	float index = mod(uv.x * dimension + floor(uv.y*dimension)*dimension, dim);
	float segment = mod(index,segments)/segments;
	float branch = floor(index/segments)/branchCount;

	branch *= PI2;

	float angle = segment * 2. + branch + sin(segment*10.+time) * .5;
	float radius = segment * 2.;
	float height = segment * .5 + sin(segment*10.-time+branch*100.)*.1;
	vec3 pos = vec3(cos(angle)*radius, height, sin(angle)*radius); 
	pos = mix(vec3(0), pos, segment);

	gl_FragColor = vec4(pos, 1);	

	

	// float indexGrow = mod(time * 10., branchSegments.y);
	// float index = floor(uv.x * dimension) + floor(uv.y * dim);
	// float branch = floor(index/branchSegments.y);
	// float branchGrow = floor(indexGrow/branchSegments.y);
	// float should = step(branch-branchGrow, .01);
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