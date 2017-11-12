
uniform float time;
uniform vec2 resolution;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(.01);
	vUv = uv;
	vAnchor = anchor;
	vIndexMap = indexMap;

	vec3 pos = position;
	pos.xy = indexMap.xy * 2. - 1.;
 	pos.z = 0.;
	pos *= 2.;
	float dist = length(pos);
	// pos.xz *= rot(time + dist);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	gl_Position.x += anchor.x * size.x * aspect.x;
	gl_Position.y += anchor.y * size.y * aspect.y;
}
