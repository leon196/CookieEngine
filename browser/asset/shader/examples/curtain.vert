
uniform float time;
uniform vec2 resolution;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec3 vSeed;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec4 vColor;

vec3 displace (vec3 pos) {
	pos.z += sin(pos.x*1. + time*5.);
	pos.x += sin(pos.y*.2 + time*10.);
	return pos;
}

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(1.);
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vSeed = position;

	vec3 pos = position;
	pos.xy = vAnchor * 20.;
	pos = displace(pos);
	float delta = .1;
	vec3 n = displace(pos + vec3(0,delta,0));
	vec3 s = displace(pos - vec3(0,delta,0));
	vec3 e = displace(pos + vec3(delta,0,0));
	vec3 w = displace(pos - vec3(delta,0,0));
	vec3 normal = cross(normalize(n-s), normalize(e-w));
	vec3 view = normalize(cameraPosition - pos);
	vColor = vec4(1,0,0,1);
	vColor *= dot(view, normal)*.5+.5;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
