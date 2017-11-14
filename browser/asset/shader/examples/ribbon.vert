
uniform float time;
uniform vec2 resolution;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec3 vDir;
varying vec3 vNormal;
varying vec3 vView;
varying vec4 vColor;

#define wave smoothstep(.0,1.,sin(4.*time*3.14159))

vec3 displace (vec3 pos, float ratio) {
	float dist = length(pos) + ratio + time * 5.;
	pos.xz *= rot(dist);
	pos.xy *= rot(dist*.5);
	pos.zy *= rot(dist*.3);
	pos *= 20.;
	return pos;
}

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(.2,1.);
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	float ratio = anchor.y * size.y;
	float delta = .1;
	vec3 next = displace(position, ratio+delta);
	vec3 prev = displace(position, ratio-delta);
	vec3 dir = normalize(next-prev);
	vec3 up = vec3(0,1,0);
	vec3 tangent = cross(dir, up);
	vec3 pos = displace(position, ratio);
	vNormal = normalize(normalize(next - pos) - normalize(prev - pos));
	vColor = vec4(dir*.5+.5, 1.);
	pos += dir + tangent * anchor.x * size.x;
	vView = normalize(cameraPosition - pos);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
