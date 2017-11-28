
uniform float time;
uniform float Paper;
uniform vec2 resolution;
uniform vec3 cameraPos;
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

vec3 displace (vec3 pos, vec2 ratio) {
	float dist = length(pos)*10. + ratio.y + time;
	pos.xz *= rot(dist);
	pos.xy *= rot(dist*.7);
	pos.zy *= rot(dist*.4);
	float d = length(pos);
	pos = normalize(pos)*d*(.75+.25*sin(ratio.x*TAU+d*10.+time));
	return pos;
}

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vec2 ratio = anchor * vec2(.02,.1) * Paper;
	float delta = .1;
	vec3 next = displace(position, ratio+delta);
	vec3 prev = displace(position, ratio-delta);
	vec3 dir = normalize(next-prev);
	vec3 up = vec3(0,1,0);
	vec3 tangent = cross(dir, up);
	vec3 pos = displace(position, ratio);
	vNormal = normalize(normalize(next - pos) - normalize(prev - pos));
	vec3 view = normalize(cameraPos - pos);
	vColor = vec4(1.) * abs(dot(-view, vNormal));
	vColor.a = length(cameraPos - pos);
	pos += (dir + tangent * anchor.x * .5) * Paper;
	vView = normalize(cameraPosition - pos);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
