
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

vec3 displace (vec3 pos, float ratio) {
	float dist = length(pos) + ratio;
	pos.xz *= rot(dist + time);
	pos.xy *= rot(dist + time*.5);
	pos.zy *= rot(dist + time*.52);
	pos *= 20.;
	// pos.x += sin(anchor.y*3.+time*10.) * .2;
	// pos.y += sin(anchor.x*3.+time*10.) * .5;
	return pos;
}

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(3.);
	vUv = uv;
	vAnchor = anchor;
	vIndexMap = indexMap;

	float ratio = position.x + anchor.y / 10.;
	float delta = .1;
	vec3 next = displace(position, ratio+delta);
	vec3 prev = displace(position, ratio-delta);
	vec3 dir = normalize(next-prev);
	vec3 up = vec3(0,1,0);
	vec3 tangent = cross(dir, up);
	vec3 pos = displace(position, ratio);
	vNormal = normalize( normalize(next - pos) - normalize(pos - prev));
	vDir = dir;
	// vNormal = cross(vNormal, vDir);
	pos += dir * anchor.y + tangent * anchor.x;

	vView = normalize(cameraPosition - pos);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	// gl_Position.xy += anchor.xy * size.xy * aspect.xy;
}
