
uniform float time;
uniform vec2 resolution;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec3 vSeed;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec3 vDir;
varying vec3 vNormal;
varying vec3 vView;

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(1.);
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vSeed = position;

	vec3 pos = position;
	float speed = 1.;
	float range = 10.;
	pos = normalize(pos) * mod(length(pos) + time*speed, 1.);
	float dist = length(pos) + time*speed;
	dist = length(pos);
	size *= smoothstep(.0,.1,dist);
	size *= 1.-smoothstep(.9,1.,dist);
	pos *= range;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	gl_Position.xy += anchor * size * aspect;
}
