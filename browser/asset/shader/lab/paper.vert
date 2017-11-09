
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendPaper;
uniform vec2 resolution;

varying float vSeed;
varying vec3 vView;
varying vec2 vAnchor;
varying float vDepth;

void main()	{
	vAnchor = anchor;
	vec3 pos;
	// pos = position*2.-1.;
	float ratio = mod(rand(pos.xz + pos.y), 1.);
	// pos = vec3(indexMap.x, 0, indexMap.y)*5.;
	float a = indexMap.y * PI2;
	pos.xy = vec2(cos(a),sin(a));
	pos.z = (indexMap.x*2.-1.)*5.;
	pos.z += atan(pos.x,pos.y);
	// pos.z *= 10.;
	float seed = noiseIQ(pos*.5);
	float dist = length(pos);
	vec3 offset = vec3(seed);
	a = noiseIQ(pos*5.)*PI2;
	offset.xz = vec2(cos(a),sin(a));
	offset.xz *= rot(ratio * PI2 + time);
	offset.xy *= rot(ratio * PI2 + time);
	float waveGrow = .1+.9*clamp(sin(pos.z+time), 0.,1.);
	pos += offset*.5*waveGrow;
	// pos.xy += normalize(pos.xz) * wave * .1;
	pos.z = repeat(pos.z*2.+time*.5, TAU*2.);
	pos.xy *= rot(time*.5);
	vec2 size = vec2(.5) * blendPaper;
	// size *= 1. + 1.*wave;
	pos *= 20.;
	vDepth = length(cameraPosition - pos);
	vSeed = seed;
	// pos.x += .5*sin(anchor.y+time+noiseIQ(pos)*5.)*(1.-anchor.y);
	vView = normalize(cameraPosition - pos);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	// size += smoothstep(.99,1.,length(gl_Position.xy)*.05);
	// size *= clamp(waveGrow, 0.,1.);
	gl_Position.x += anchor.x * aspect.x * size.x;
	gl_Position.y += anchor.y * aspect.y * size.y;
}
