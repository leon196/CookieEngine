
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
	vec2 size = vec2(.05);
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vSeed = position;

	vec3 pos = position;
	float angle = PI2 * (indexMap.x * 8. + indexMap.y * 8. * 8.) / 32.;
	angle += time*.1;
	float radius = .9;
	pos.xy = vec2(cos(angle),sin(angle)) * radius;
	pos.x *= aspect.x;

	gl_Position = vec4(pos.xy, 0., 1.);
	gl_Position.xy += anchor * size * aspect;
}
