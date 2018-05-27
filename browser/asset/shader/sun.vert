
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

void displace (inout vec3 p) {
	float t = 13.;
	p.xz *= rot(t * .2);
	p.xy *= rot(PI/2.+.2);
}

void main () {
	vUv = uv;

	vec4 pos = modelMatrix * vec4(position, 1);


	// pos.xz *= rot(-time*.9);
	// pos.xy *= rot(-time*.6);
	pos.x -= 50.;
	displace(pos.xyz);

	vNormal = normal;
	displace(vNormal);
	vView = pos.xyz - cameraPosition;
	vPosWorld = pos.xyz;

	gl_Position = projectionMatrix * viewMatrix * pos;
}