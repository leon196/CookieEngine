
uniform float time;
uniform vec2 resolution;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(3.);
	vUv = uv;
	vAnchor = anchor;
	vIndexMap = indexMap;

	vec3 pos = position;
	float dist = length(pos);
	pos.xz *= rot(dist + time);
	pos.xy *= rot(dist + time*.5);
	pos.zy *= rot(dist + time*.52);
	pos *= 20.;
	pos.x += sin(anchor.y*3.+time*10.) * .2;
	pos.y += sin(anchor.x*3.+time*10.) * .5;
	// pos.xy += anchor.xy * size.xy;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	gl_Position.xy += anchor.xy * size.xy * aspect.xy;
}
