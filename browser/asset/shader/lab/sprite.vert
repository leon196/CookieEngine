
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform vec2 resolution;

varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vPosScreen;

void main()	{
	vUv = uv;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vNormal = normal;
	vec3 pos = position;
	float height = 1.;
	vec2 size = vec2(.05);
	float speed = .01 + .5 * noiseIQ(pos*2.2);
	float rnd = rand(pos.xz+indexMap);
	float ratio = mod(rnd*2.+time*speed, 1.);
	float fade = smoothstep(.0,.1,ratio)*smoothstep(0.,.1,1.-ratio);
	// pos.y += ratio * height;
	// pos.xz += normalize(pos.xz) * length(pos.xz) * ratio;
	// size *= fade * (.5+.5*rnd);
	vPos = pos;
	float len = length(pos.xz)+1.;
	float a = mod(rnd+time*.1,1.)*PI2;
	// float r = 1. + 2. * rnd;
	pos.x += cos(a);
	pos.z += sin(a);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * aspect.x * size.x;
	gl_Position.y += anchor.y * aspect.y * size.y;
	vPosScreen = gl_Position.xy;
}