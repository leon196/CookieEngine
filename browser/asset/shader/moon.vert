
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

void displace (inout vec3 p) {
	p.xz *= rot(time * .1);
	// p.xy *= rot(PI/2.+.8);
}

void main () {
	vUv = uv;

	vec4 pos = modelMatrix * vec4(position, 1);
	// pos.xyz *= 1.5;

	pos.xz *= rot(time*.9);
	pos.yz *= rot(time*.6);
	pos.xy *= rot(time*.3);
	pos.x -= 45.;
	pos.y += 60.;
	displace(pos.xyz);

	vNormal = normal;
	displace(vNormal);
	vView = pos.xyz - cameraPosition;
	vPosWorld = pos.xyz;

	gl_Position = projectionMatrix * viewMatrix * pos;
}